import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OffsetPaginationDto } from '../dto/offset-pagination.dto';
import { PaginationResponse } from '../interfaces/db-pagination.interface';
import { UserBenchmarkEntity } from '../entities/user-benchmark.entity';

@Injectable()
export class DbPaginationNaiveService {
  constructor(private readonly dataSource: DataSource) {}

  async getNaiveOffsetUsers(dto: OffsetPaginationDto): Promise<PaginationResponse<UserBenchmarkEntity>> {
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Math.max(1, Number(dto.limit) || 20);
    const offset = (page - 1) * limit;

    const startMs = performance.now();

    // Naive O(N) Offset SQL query: scans & discards `offset` rows before returning `limit` rows
    const query = `
      SELECT id, username, email, age, status, created_at AS "createdAt"
      FROM benchmark_users
      ORDER BY id ASC
      LIMIT $1 OFFSET $2
    `;

    const data: UserBenchmarkEntity[] = await this.dataSource.query(query, [limit, offset]);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      data,
      meta: {
        page,
        limit,
        hasMore: data.length === limit,
      },
      performance: {
        executionTimeMs,
        strategy: 'NAIVE_OFFSET',
        scanType: offset > 50000 ? 'Sequential / High Index Skip Cost (Seq/Index Scan O(N))' : 'Index Scan',
        totalRowsScannedEstimate: `~${offset + data.length} rows scanned & discarded`,
      },
    };
  }
}
