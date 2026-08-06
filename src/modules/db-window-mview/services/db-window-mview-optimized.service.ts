import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';
import { AnalyticsResponse } from '../interfaces/db-window-mview.interface';

@Injectable()
export class DbWindowMviewOptimizedService {
  constructor(private readonly dataSource: DataSource) {}

  async getWindowAnalyticsOptimized(dto: AnalyticsQueryDto): Promise<AnalyticsResponse<any>> {
    const limit = Math.max(1, Number(dto.limit) || 50);
    const initialMemory = process.memoryUsage().heapUsed;
    const startMs = performance.now();

    // OPTIMIZED SQL WINDOW FUNCTIONS: Executed 100% inside PostgreSQL engine, returning only aggregated results!
    const query = `
      SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt",
             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total_amount DESC) AS "userRank",
             SUM(total_amount) OVER (PARTITION BY user_id ORDER BY created_at ASC) AS "runningTotalRevenue",
             LAG(total_amount) OVER (PARTITION BY user_id ORDER BY created_at ASC) AS "previousOrderAmount"
      FROM benchmark_indexing_orders
      ORDER BY user_id ASC, "userRank" ASC
      LIMIT $1
    `;

    const data = await this.dataSource.query(query, [limit]);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
    const heapUsedMb = Number(((process.memoryUsage().heapUsed - initialMemory) / (1024 * 1024)).toFixed(2));

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs,
        heapUsedMb: Math.max(0.001, heapUsedMb),
        strategy: 'SQL_WINDOW_FUNCTIONS',
        description: 'ROW_NUMBER(), SUM() OVER, and LAG() computed inside PostgreSQL engine; zero Node.js memory overhead',
      },
    };
  }

  private async ensureMaterializedViewExists(): Promise<void> {
    await this.dataSource.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_order_analytics AS
      SELECT user_id AS "userId",
             COUNT(id) AS "totalOrders",
             SUM(total_amount) AS "totalSpent",
             AVG(total_amount) AS "avgOrderAmount",
             MAX(created_at) AS "lastOrderDate"
      FROM benchmark_indexing_orders
      GROUP BY user_id;
    `);

    await this.dataSource.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_analytics_id ON mv_user_order_analytics ("userId");
    `);
  }

  async getMaterializedViewAnalyticsOptimized(dto: AnalyticsQueryDto): Promise<AnalyticsResponse<any>> {
    await this.ensureMaterializedViewExists();

    const limit = Math.max(1, Number(dto.limit) || 50);
    const initialMemory = process.memoryUsage().heapUsed;
    const startMs = performance.now();

    const query = `
      SELECT "userId", "totalOrders", "totalSpent", "avgOrderAmount", "lastOrderDate"
      FROM mv_user_order_analytics
      ORDER BY "totalSpent" DESC
      LIMIT $1
    `;

    const data = await this.dataSource.query(query, [limit]);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
    const heapUsedMb = Number(((process.memoryUsage().heapUsed - initialMemory) / (1024 * 1024)).toFixed(2));

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs,
        heapUsedMb: Math.max(0.001, heapUsedMb),
        strategy: 'MATERIALIZED_VIEW_QUERY',
        description: 'Instant read from pre-computed PostgreSQL Materialized View table',
      },
    };
  }

  async refreshMaterializedViewConcurrently(): Promise<{ message: string; executionTimeMs: number }> {
    await this.ensureMaterializedViewExists();

    const startMs = performance.now();

    // NON-BLOCKING CONCURRENT REFRESH: Refreshes Materialized View without locking SELECT read traffic!
    await this.dataSource.query(`
      REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_order_analytics;
    `);

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      message: 'Successfully refreshed Materialized View CONCURRENTLY without locking read traffic',
      executionTimeMs,
    };
  }
}
