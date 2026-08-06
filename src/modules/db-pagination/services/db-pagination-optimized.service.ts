import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OffsetPaginationDto } from '../dto/offset-pagination.dto';
import { KeysetPaginationDto } from '../dto/keyset-pagination.dto';
import { SeedUsersDto } from '../dto/seed-users.dto';
import { PaginationResponse } from '../interfaces/db-pagination.interface';
import { UserBenchmarkEntity } from '../entities/user-benchmark.entity';

@Injectable()
export class DbPaginationOptimizedService {
  constructor(private readonly dataSource: DataSource) {}

  async getDeferredJoinUsers(dto: OffsetPaginationDto): Promise<PaginationResponse<UserBenchmarkEntity>> {
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Math.max(1, Number(dto.limit) || 20);
    const offset = (page - 1) * limit;

    const startMs = performance.now();

    // Deferred Join Optimization: Subquery retrieves ONLY primary keys via B-Tree index scan before joining full record data
    const query = `
      SELECT u.id, u.username, u.email, u.age, u.status, u.created_at AS "createdAt"
      FROM benchmark_users u
      INNER JOIN (
        SELECT id FROM benchmark_users ORDER BY id ASC LIMIT $1 OFFSET $2
      ) AS tmp ON u.id = tmp.id
      ORDER BY u.id ASC
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
        strategy: 'DEFERRED_JOIN',
        scanType: 'Index Only Scan (PK Subquery) + Nested Loop / Hash Join',
        totalRowsScannedEstimate: `Only ${limit} full row I/Os fetched from heap`,
      },
    };
  }

  async getKeysetUsers(dto: KeysetPaginationDto): Promise<PaginationResponse<UserBenchmarkEntity>> {
    const cursor = Math.max(0, Number(dto.cursor) || 0);
    const limit = Math.max(1, Number(dto.limit) || 20);

    const startMs = performance.now();

    // Keyset / Cursor-based Pagination: O(1) constant time index seek via B-Tree WHERE id > $1
    const query = `
      SELECT id, username, email, age, status, created_at AS "createdAt"
      FROM benchmark_users
      WHERE id > $1
      ORDER BY id ASC
      LIMIT $2
    `;

    const data: UserBenchmarkEntity[] = await this.dataSource.query(query, [cursor, limit]);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    return {
      data,
      meta: {
        limit,
        nextCursor,
        hasMore: data.length === limit,
      },
      performance: {
        executionTimeMs,
        strategy: 'KEYSET_CURSOR',
        scanType: 'Index Seek (B-Tree O(1) Constant Time Lookup)',
        totalRowsScannedEstimate: `Exactly ${data.length} rows read via index seek`,
      },
    };
  }

  async seedUsers(dto: SeedUsersDto): Promise<{ message: string; seededCount: number; executionTimeMs: number }> {
    const totalRows = dto.totalRows || 100000;
    const batchSize = Math.min(10000, dto.batchSize || 10000);

    const startMs = performance.now();

    // Fast batch seeding in chunks
    for (let i = 0; i < totalRows; i += batchSize) {
      const currentBatch = Math.min(batchSize, totalRows - i);
      const values: string[] = [];

      for (let j = 0; j < currentBatch; j++) {
        const index = i + j + 1;
        values.push(`('user_${index}', 'user_${index}@example.com', ${20 + (index % 40)}, 'ACTIVE', NOW())`);
      }

      const bulkQuery = `
        INSERT INTO benchmark_users (username, email, age, status, created_at)
        VALUES ${values.join(',')}
      `;

      await this.dataSource.query(bulkQuery);
    }

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      message: `Successfully seeded ${totalRows} benchmark user records`,
      seededCount: totalRows,
      executionTimeMs,
    };
  }
}
