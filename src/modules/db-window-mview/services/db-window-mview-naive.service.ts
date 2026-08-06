import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';
import { AnalyticsResponse } from '../interfaces/db-window-mview.interface';

@Injectable()
export class DbWindowMviewNaiveService {
  constructor(private readonly dataSource: DataSource) {}

  async getAnalyticsNaive(dto: AnalyticsQueryDto): Promise<AnalyticsResponse<any>> {
    const limit = Math.max(1, Number(dto.limit) || 50);
    const initialMemory = process.memoryUsage().heapUsed;
    const startMs = performance.now();

    // NAIVE IN-MEMORY AGGREGATION: Fetching raw rows into Node.js Heap Memory & looping in JS
    const rawRows = await this.dataSource.query(`
      SELECT id, user_id, status, total_amount, created_at
      FROM benchmark_indexing_orders
      ORDER BY user_id ASC, total_amount DESC
      LIMIT 10000
    `);

    // In-Memory JS Array ranking and running sum calculations (blocks Event Loop under load)
    const userOrdersMap = new Map<number, any[]>();
    for (const row of rawRows) {
      const uid = Number(row.user_id);
      if (!userOrdersMap.has(uid)) {
        userOrdersMap.set(uid, []);
      }
      userOrdersMap.get(uid)!.push({
        id: row.id,
        userId: uid,
        status: row.status,
        totalAmount: Number(row.total_amount),
        createdAt: row.created_at,
      });
    }

    const processedResults: any[] = [];
    userOrdersMap.forEach((orders) => {
      let runningSum = 0;
      orders.forEach((order, index) => {
        runningSum += order.totalAmount;
        const prevAmount = index > 0 ? orders[index - 1].totalAmount : null;
        processedResults.push({
          ...order,
          userRank: index + 1,
          runningTotalRevenue: Number(runningSum.toFixed(2)),
          previousOrderAmount: prevAmount,
        });
      });
    });

    const data = processedResults.slice(0, limit);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
    const heapUsedMb = Number(((process.memoryUsage().heapUsed - initialMemory) / (1024 * 1024)).toFixed(2));

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs,
        heapUsedMb: Math.max(0.01, heapUsedMb),
        strategy: 'NAIVE_JS_ARRAY_AGGREGATION',
        description: 'Raw rows loaded into Node.js heap memory; JS loop performed ranking and running sum calculations',
      },
    };
  }
}
