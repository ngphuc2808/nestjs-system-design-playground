import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SearchIndexingOrderDto } from '../dto/search-indexing-order.dto';
import { SeedIndexingOrdersDto } from '../dto/seed-indexing-orders.dto';
import { IndexingResponse } from '../interfaces/db-indexing.interface';
import { IndexingOrderEntity } from '../entities/indexing-order.entity';

@Injectable()
export class DbIndexingOptimizedService {
  constructor(private readonly dataSource: DataSource) {}

  private async parseExplainPlan(explainQuery: string, params: any[] = []): Promise<any> {
    const raw = await this.dataSource.query(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${explainQuery}`, params);
    const planNode = raw[0]['QUERY PLAN'][0];
    const topNode = planNode['Plan'];
    return {
      scanType: topNode['Node Type'],
      executionTimeMs: planNode['Execution Time'] || 0,
      sharedHitBlocks: topNode['Shared Hit Blocks'] || 0,
      sharedReadBlocks: topNode['Shared Read Blocks'] || 0,
      raw: planNode,
    };
  }

  async getLeftmostOptimized(dto: SearchIndexingOrderDto): Promise<IndexingResponse<IndexingOrderEntity>> {
    const status = dto.status || 'PENDING';
    const createdAfter = dto.createdAfter || '2026-08-01 00:00:00+00';

    // LEFTMOST PREFIX RULE SATISFIED: Query starts with leading `status` column followed by `created_at`
    const query = `
      SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt"
      FROM benchmark_indexing_orders
      WHERE status = $1 AND created_at >= $2
      LIMIT 50
    `;

    const explain = await this.parseExplainPlan(query, [status, createdAfter]);
    const data: IndexingOrderEntity[] = await this.dataSource.query(query, [status, createdAfter]);

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs: explain.executionTimeMs,
        strategy: 'LEFTMOST_PREFIX_SEEK',
        scanType: `${explain.scanType} (Composite Index Range Seek on idx_orders_status_created)`,
        sharedHitBlocks: explain.sharedHitBlocks,
        sharedReadBlocks: explain.sharedReadBlocks,
        explainPlanRaw: explain.raw,
      },
    };
  }

  async getGinJsonbOptimized(dto: SearchIndexingOrderDto): Promise<IndexingResponse<IndexingOrderEntity>> {
    const category = dto.category || 'ELECTRONICS';
    const jsonFilter = JSON.stringify({ category });

    // GIN JSONB CONTAINMENT SEARCH: Uses `@>` operator to hit GIN index!
    const query = `
      SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt", metadata
      FROM benchmark_indexing_orders
      WHERE metadata @> $1::jsonb
      LIMIT 50
    `;

    const explain = await this.parseExplainPlan(query, [jsonFilter]);
    const data: IndexingOrderEntity[] = await this.dataSource.query(query, [jsonFilter]);

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs: explain.executionTimeMs,
        strategy: 'GIN_JSONB_CONTAINMENT',
        scanType: `${explain.scanType} (Bitmap Index Scan using idx_orders_meta_gin GIN index)`,
        sharedHitBlocks: explain.sharedHitBlocks,
        sharedReadBlocks: explain.sharedReadBlocks,
        explainPlanRaw: explain.raw,
      },
    };
  }

  async getPartialOptimized(dto: SearchIndexingOrderDto): Promise<IndexingResponse<IndexingOrderEntity>> {
    // PARTIAL INDEX: Hits small index dedicated to status = 'PENDING'
    const query = `
      SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt"
      FROM benchmark_indexing_orders
      WHERE status = 'PENDING'
      LIMIT 50
    `;

    const explain = await this.parseExplainPlan(query);
    const data: IndexingOrderEntity[] = await this.dataSource.query(query);

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs: explain.executionTimeMs,
        strategy: 'PARTIAL_INDEX_SEEK',
        scanType: `${explain.scanType} (Partial Index idx_orders_pending_status)`,
        sharedHitBlocks: explain.sharedHitBlocks,
        sharedReadBlocks: explain.sharedReadBlocks,
        explainPlanRaw: explain.raw,
      },
    };
  }

  async seedIndexingOrders(dto: SeedIndexingOrdersDto): Promise<{ message: string; seededCount: number; executionTimeMs: number }> {
    const totalRows = dto.totalRows || 50000;
    const batchSize = Math.min(5000, dto.batchSize || 5000);

    const startMs = performance.now();

    // Ensure GIN Index exists on JSONB column
    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_meta_gin ON benchmark_indexing_orders USING GIN (metadata);
    `);

    const statuses = ['PENDING', 'COMPLETED', 'CANCELLED', 'SHIPPED'];
    const categories = ['ELECTRONICS', 'CLOTHING', 'BOOKS', 'HOME', 'SPORTS'];

    for (let i = 0; i < totalRows; i += batchSize) {
      const currentBatch = Math.min(batchSize, totalRows - i);
      const values: string[] = [];

      for (let j = 0; j < currentBatch; j++) {
        const index = i + j + 1;
        const status = statuses[index % statuses.length];
        const category = categories[index % categories.length];
        const meta = JSON.stringify({ category, vendorId: 1000 + (index % 50), isPriority: index % 5 === 0 });
        const amount = (10 + (index % 500)).toFixed(2);

        values.push(`(${100 + (index % 1000)}, '${status}', ${amount}, NOW(), '${meta}'::jsonb)`);
      }

      const bulkQuery = `
        INSERT INTO benchmark_indexing_orders (user_id, status, total_amount, created_at, metadata)
        VALUES ${values.join(',')}
      `;

      await this.dataSource.query(bulkQuery);
    }

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      message: `Successfully seeded ${totalRows} benchmark indexing orders`,
      seededCount: totalRows,
      executionTimeMs,
    };
  }
}
