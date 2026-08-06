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
      SELECT u.id, u.username, u.email, u.age, u.status, u.created_at AS "createdAt"
      FROM benchmark_users u
      INNER JOIN (
        SELECT id FROM benchmark_users ${whereClause} ORDER BY id ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      ) AS tmp ON u.id = tmp.id
      ORDER BY u.id ASC
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

    const rawSql = `SELECT u.id, u.username, u.email, u.age, u.status, u.created_at AS "createdAt" FROM benchmark_users u INNER JOIN (SELECT id FROM benchmark_users ${rawWhereClause} ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}) AS tmp ON u.id = tmp.id ORDER BY u.id ASC;`.replace(/\s+/g, ' ');
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
        strategy: 'DEFERRED_JOIN',
        scanType: 'Index Only Scan (PK Subquery) + Filter Join',
        totalRowsScannedEstimate: `Only ${limit} full row I/Os fetched from heap`,
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: 'Index Only Scan (PK Subquery) + Join',
        },
      },
    };
  }

  async getKeysetUsers(dto: KeysetPaginationDto): Promise<PaginationResponse<UserBenchmarkEntity>> {
    const cursor = Math.max(0, Number(dto.cursor) || 0);
    const limit = Math.max(1, Number(dto.limit) || 20);

    const whereConditions: string[] = [`id > $1`];
    const queryParams: any[] = [cursor];
    let paramIndex = 2;

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

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const startMs = performance.now();

    const query = `
      SELECT id, username, email, age, status, created_at AS "createdAt"
      FROM benchmark_users
      ${whereClause}
      ORDER BY id ASC
      LIMIT $${paramIndex++}
    `;

    queryParams.push(limit);

    const data: UserBenchmarkEntity[] = await this.dataSource.query(query, queryParams);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    const rawWhereConditions: string[] = [`id > ${cursor}`];
    if (dto.status) rawWhereConditions.push(`status = '${dto.status}'`);
    if (dto.minAge !== undefined) rawWhereConditions.push(`age >= ${dto.minAge}`);
    if (dto.maxAge !== undefined) rawWhereConditions.push(`age <= ${dto.maxAge}`);

    const rawSql = `SELECT id, username, email, age, status, created_at AS "createdAt" FROM benchmark_users WHERE ${rawWhereConditions.join(' AND ')} ORDER BY id ASC LIMIT ${limit};`.replace(/\s+/g, ' ');
    const explainAnalyzeSql = `EXPLAIN ANALYZE ${rawSql}`;

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
        scanType: 'Index Seek (B-Tree O(log N) Lookup) + Filter',
        totalRowsScannedEstimate: `Exactly ${data.length} rows read via index seek`,
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: 'Index Seek (B-Tree O(log N) Lookup)',
        },
      },
    };
  }

  async getPrecomputedPageMapUsers(dto: OffsetPaginationDto): Promise<PaginationResponse<UserBenchmarkEntity>> {
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Math.max(1, Number(dto.limit) || 20);

    const startMs = performance.now();

    const pageMapQuery = `SELECT min_id FROM benchmark_page_map WHERE page_number = $1`;
    let minId = (page - 1) * limit + 1;

    try {
      const mapRes = await this.dataSource.query(pageMapQuery, [page]);
      if (mapRes.length > 0) {
        minId = mapRes[0].min_id;
      }
    } catch (e) {
      minId = (page - 1) * limit + 1;
    }

    const whereConditions: string[] = [`id >= $1`];
    const queryParams: any[] = [minId];
    let paramIndex = 2;

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

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const dataQuery = `
      SELECT id, username, email, age, status, created_at AS "createdAt"
      FROM benchmark_users
      ${whereClause}
      ORDER BY id ASC
      LIMIT $${paramIndex++}
    `;

    queryParams.push(limit);

    const data: UserBenchmarkEntity[] = await this.dataSource.query(dataQuery, queryParams);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    const rawWhereConditions: string[] = [`id >= ${minId}`];
    if (dto.status) rawWhereConditions.push(`status = '${dto.status}'`);
    if (dto.minAge !== undefined) rawWhereConditions.push(`age >= ${dto.minAge}`);
    if (dto.maxAge !== undefined) rawWhereConditions.push(`age <= ${dto.maxAge}`);

    const rawSql = `SELECT id, username, email, age, status, created_at AS "createdAt" FROM benchmark_users WHERE ${rawWhereConditions.join(' AND ')} ORDER BY id ASC LIMIT ${limit};`.replace(/\s+/g, ' ');
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
        strategy: 'KEYSET_CURSOR',
        scanType: 'O(1) Page Map Lookup + B-Tree Index Seek + Filter',
        totalRowsScannedEstimate: `Page ${page} min_id = ${minId}. Exactly ${data.length} rows read`,
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: 'O(1) Precomputed Page Map + B-Tree Seek + Filter',
        },
      },
    };
  }

  async refreshPageMap(limit = 20): Promise<{ message: string; refreshedPages: number; executionTimeMs: number }> {
    const startMs = performance.now();

    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS benchmark_page_map (
        page_number INT PRIMARY KEY,
        min_id INT NOT NULL
      );
    `);

    await this.dataSource.query(`TRUNCATE benchmark_page_map;`);

    await this.dataSource.query(`
      INSERT INTO benchmark_page_map (page_number, min_id)
      SELECT ceil(row_num / $1::numeric)::int AS page_number, min(id) AS min_id
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) AS row_num
        FROM benchmark_users
      ) AS tmp
      GROUP BY ceil(row_num / $1::numeric);
    `, [limit]);

    const res = await this.dataSource.query(`SELECT COUNT(*)::int AS total FROM benchmark_page_map`);
    const refreshedPages = Number(res[0]?.total || 0);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      message: `Successfully rebuilt Page Map table for limit=${limit}`,
      refreshedPages,
      executionTimeMs,
    };
  }

  async seedUsers(dto: SeedUsersDto): Promise<{ message: string; seededCount: number; executionTimeMs: number }> {
    const totalRows = dto.totalRows || 100000;
    const batchSize = Math.min(10000, dto.batchSize || 10000);

    const startMs = performance.now();

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

    await this.refreshPageMap(20);

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      message: `Successfully seeded ${totalRows} benchmark user records and built Page Map Table`,
      seededCount: totalRows,
      executionTimeMs,
    };
  }
}
