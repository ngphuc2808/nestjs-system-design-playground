import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DeductStockDto } from '../dto/deduct-stock.dto';
import { SeedInventoryDto } from '../dto/seed-inventory.dto';
import { DeductionResult } from '../interfaces/concurrency-locking.interface';

@Injectable()
export class ConcurrencyLockingOptimizedService {
  constructor(private readonly dataSource: DataSource) {}

  async deductOptimistic(dto: DeductStockDto): Promise<DeductionResult> {
    const startMs = performance.now();
    const productId = Number(dto.productId) || 1;
    const quantity = Math.max(1, Number(dto.quantity) || 1);

    // Fetch current stock and version
    const products = await this.dataSource.query(
      `SELECT stock, version FROM benchmark_products WHERE id = $1`,
      [productId],
    );

    if (products.length === 0) {
      return {
        success: false,
        productId,
        remainingStock: 0,
        message: 'Product not found',
        performance: {
          executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
          strategy: 'OPTIMISTIC_OCC_VERSION',
          description: 'Product not found',
        },
      };
    }

    const currentStock = Number(products[0].stock);
    const currentVersion = Number(products[0].version);

    if (currentStock < quantity) {
      return {
        success: false,
        productId,
        remainingStock: currentStock,
        version: currentVersion,
        message: `Insufficient stock (Requested: ${quantity}, Available: ${currentStock})`,
        performance: {
          executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
          strategy: 'OPTIMISTIC_OCC_VERSION',
          description: 'Stock insufficient',
        },
      };
    }

    // OPTIMISTIC CONCURRENCY CONTROL (OCC): Update fails if another request bumped the version column!
    const updateResult = await this.dataSource.query(
      `
      UPDATE benchmark_products
      SET stock = stock - $1, version = version + 1
      WHERE id = $2 AND version = $3 AND stock >= $1
      RETURNING stock, version
    `,
      [quantity, productId, currentVersion],
    );

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    if (updateResult[1] === 0 || updateResult[0].length === 0) {
      return {
        success: false,
        productId,
        remainingStock: currentStock,
        version: currentVersion,
        message: 'Optimistic Lock Conflict: Version mismatch detected. Concurrent write rejected!',
        performance: {
          executionTimeMs,
          strategy: 'OPTIMISTIC_OCC_VERSION',
          description: 'Version mismatch detected; write rejected safely without corruption',
        },
      };
    }

    const newStock = Number(updateResult[0][0].stock);
    const newVersion = Number(updateResult[0][0].version);

    return {
      success: true,
      productId,
      remainingStock: newStock,
      version: newVersion,
      message: `Optimistic stock deduction succeeded (Stock: ${newStock}, Version: ${newVersion})`,
      performance: {
        executionTimeMs,
        strategy: 'OPTIMISTIC_OCC_VERSION',
        description: 'Version check matched; row updated atomically',
      },
    };
  }

  async deductPessimistic(dto: DeductStockDto): Promise<DeductionResult> {
    const startMs = performance.now();
    const productId = Number(dto.productId) || 1;
    const quantity = Math.max(1, Number(dto.quantity) || 1);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // PESSIMISTIC LOCKING: Acquires exclusive row-level lock FOR UPDATE
      const products = await queryRunner.query(
        `SELECT stock, version FROM benchmark_products WHERE id = $1 FOR UPDATE`,
        [productId],
      );

      if (products.length === 0) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          productId,
          remainingStock: 0,
          message: 'Product not found',
          performance: {
            executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
            strategy: 'PESSIMISTIC_FOR_UPDATE',
            description: 'Product not found',
          },
        };
      }

      const currentStock = Number(products[0].stock);

      if (currentStock < quantity) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          productId,
          remainingStock: currentStock,
          message: `Insufficient stock (Requested: ${quantity}, Available: ${currentStock})`,
          performance: {
            executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
            strategy: 'PESSIMISTIC_FOR_UPDATE',
            description: 'Stock insufficient under row lock',
          },
        };
      }

      const updateResult = await queryRunner.query(
        `UPDATE benchmark_products SET stock = stock - $1 WHERE id = $2 RETURNING stock, version`,
        [quantity, productId],
      );

      await queryRunner.commitTransaction();

      const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
      const newStock = Number(updateResult[0][0].stock);

      return {
        success: true,
        productId,
        remainingStock: newStock,
        message: `Pessimistic FOR UPDATE deduction succeeded (Stock: ${newStock})`,
        performance: {
          executionTimeMs,
          strategy: 'PESSIMISTIC_FOR_UPDATE',
          description: 'Row-level FOR UPDATE lock serialized concurrent writes with 100% safety',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deductAdvisory(dto: DeductStockDto): Promise<DeductionResult> {
    const startMs = performance.now();
    const productId = Number(dto.productId) || 1;
    const quantity = Math.max(1, Number(dto.quantity) || 1);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // POSTGRESQL ADVISORY LOCK: Locks application key inside transaction context
      await queryRunner.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [`product_${productId}`]);

      const products = await queryRunner.query(
        `SELECT stock FROM benchmark_products WHERE id = $1`,
        [productId],
      );

      if (products.length === 0) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          productId,
          remainingStock: 0,
          message: 'Product not found',
          performance: {
            executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
            strategy: 'POSTGRES_ADVISORY_LOCK',
            description: 'Product not found',
          },
        };
      }

      const currentStock = Number(products[0].stock);

      if (currentStock < quantity) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          productId,
          remainingStock: currentStock,
          message: `Insufficient stock (Requested: ${quantity}, Available: ${currentStock})`,
          performance: {
            executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
            strategy: 'POSTGRES_ADVISORY_LOCK',
            description: 'Stock insufficient under advisory lock',
          },
        };
      }

      const updateResult = await queryRunner.query(
        `UPDATE benchmark_products SET stock = stock - $1 WHERE id = $2 RETURNING stock`,
        [quantity, productId],
      );

      await queryRunner.commitTransaction();

      const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
      const newStock = Number(updateResult[0][0].stock);

      return {
        success: true,
        productId,
        remainingStock: newStock,
        message: `PostgreSQL Advisory Lock deduction succeeded (Stock: ${newStock})`,
        performance: {
          executionTimeMs,
          strategy: 'POSTGRES_ADVISORY_LOCK',
          description: 'pg_advisory_xact_lock held transaction key; released automatically on commit',
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async seedInventory(dto: SeedInventoryDto): Promise<{ message: string; productId: number; initialStock: number }> {
    const productId = Number(dto.productId) || 1;
    const initialStock = Number(dto.initialStock) || 100;

    await this.dataSource.query(
      `
      INSERT INTO benchmark_products (id, name, stock, version, updated_at)
      VALUES ($1, 'High Demand Gaming Console', $2, 1, NOW())
      ON CONFLICT (id)
      DO UPDATE SET stock = $2, version = 1, updated_at = NOW()
    `,
      [productId, initialStock],
    );

    return {
      message: `Successfully reset product #${productId} stock to ${initialStock} units`,
      productId,
      initialStock,
    };
  }
}
