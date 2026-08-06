import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DeductStockDto } from '../dto/deduct-stock.dto';
import { DeductionResult } from '../interfaces/concurrency-locking.interface';

@Injectable()
export class ConcurrencyLockingNaiveService {
  constructor(private readonly dataSource: DataSource) {}

  async deductNaive(dto: DeductStockDto): Promise<DeductionResult> {
    const startMs = performance.now();
    const productId = Number(dto.productId) || 1;
    const quantity = Math.max(1, Number(dto.quantity) || 1);

    // NAIVE READ-MODIFY-WRITE: Separate SELECT and UPDATE without locking!
    const products = await this.dataSource.query(
      `SELECT id, name, stock, version FROM benchmark_products WHERE id = $1`,
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
          strategy: 'UNPROTECTED_READ_MODIFY_WRITE',
          description: 'Product not found',
        },
      };
    }

    const currentStock = Number(products[0].stock);

    // Simulate async business operation gap (e.g. payment gateway check)
    await new Promise((resolve) => setTimeout(resolve, 10));

    if (currentStock < quantity) {
      return {
        success: false,
        productId,
        remainingStock: currentStock,
        message: `Insufficient stock (Requested: ${quantity}, Available: ${currentStock})`,
        performance: {
          executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
          strategy: 'UNPROTECTED_READ_MODIFY_WRITE',
          description: 'Unprotected stock check failed',
        },
      };
    }

    // Unprotected update: Overwrites stock based on stale read!
    const newStock = currentStock - quantity;
    await this.dataSource.query(`UPDATE benchmark_products SET stock = $1 WHERE id = $2`, [newStock, productId]);

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      success: true,
      productId,
      remainingStock: newStock,
      message: `Unprotected deduction succeeded (newStock: ${newStock}). High risk of overbooking!`,
      performance: {
        executionTimeMs,
        strategy: 'UNPROTECTED_READ_MODIFY_WRITE',
        description: 'Unprotected Read-Modify-Write caused lost updates under concurrent calls',
      },
    };
  }
}
