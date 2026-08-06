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

    const whereConditions: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (dto.status) {
      whereConditions.push(`status = $${paramIndex++}`);
      queryParams.push(dto.status);
    }
    if (dto.minAge !== undefined) {
      whereConditions.push(`age >= $${paramIndex++}`);
      queryParams.push(Number(dto.minAge));
    }
    if (dto.maxAge !== undefined) {
      whereConditions.push(`age <= $${paramIndex++}`);
      queryParams.push(Number(dto.maxAge));
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const startMs = performance.now();

    const query = `
      SELECT id, username, email, age, status, created_at AS "createdAt"
      FROM benchmark_users
      ${whereClause}
      ORDER BY id ASC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const data: UserBenchmarkEntity[] = await this.dataSource.query(query, queryParams);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    const rawWhereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.map((_, i) => {
          if (i === 0 && dto.status) return `status = '${dto.status}'`;
          if (dto.minAge !== undefined && dto.maxAge !== undefined) {
            return i === (dto.status ? 1 : 0) ? `age >= ${dto.minAge}` : `age <= ${dto.maxAge}`;
          }
          if (dto.minAge !== undefined) return `age >= ${dto.minAge}`;
          if (dto.maxAge !== undefined) return `age <= ${dto.maxAge}`;
          return '';
        }).join(' AND ')}`
      : '';

    const rawSql = `SELECT id, username, email, age, status, created_at AS "createdAt" FROM benchmark_users ${rawWhereClause} ORDER BY id ASC LIMIT ${limit} OFFSET ${offset};`.replace(/\s+/g, ' ');
    const explainAnalyzeSql = `EXPLAIN ANALYZE ${rawSql}`;

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
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: 'Sequential / Index Scan O(N) Filtered',
        },
      },
    };
  }
}
