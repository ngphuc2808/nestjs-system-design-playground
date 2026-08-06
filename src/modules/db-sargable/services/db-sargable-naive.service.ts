import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SearchDateDto } from '../dto/search-date.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { SargableResponse } from '../interfaces/db-sargable.interface';
import { UserBenchmarkEntity } from '../../db-pagination/entities/user-benchmark.entity';

@Injectable()
export class DbSargableNaiveService {
  constructor(private readonly dataSource: DataSource) {}

  async searchDateNaive(dto: SearchDateDto): Promise<SargableResponse<UserBenchmarkEntity>> {
    const targetDate = dto.targetDate || dto.date || '2026-08-01';
    const startMs = performance.now();

    // NON-SARGABLE QUERY: Function wrapping DATE(created_at) prevents B-Tree Index usage!
    const query = `SELECT id, username, email, age, status, created_at AS "createdAt" FROM benchmark_users WHERE DATE(created_at) = $1 LIMIT 50`;

    const data: UserBenchmarkEntity[] = await this.dataSource.query(query, [targetDate]);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    const rawSql = `SELECT id, username, email, age, status, created_at AS "createdAt" FROM benchmark_users WHERE DATE(created_at) = '${targetDate}' LIMIT 50;`;
    const explainAnalyzeSql = `EXPLAIN ANALYZE ${rawSql}`;

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs,
        strategy: 'NON_SARGABLE_DATE_WRAP',
        scanType: 'Seq Scan (Full Table Scan due to DATE() function wrapping column)',
        planCacheStatus: 'Disabled (Function expression evaluated per row)',
        queryExecuted: rawSql,
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: 'Seq Scan (Full Table Scan)',
        },
      },
    };
  }

  async searchUserRawStringNaive(dto: SearchUserDto): Promise<SargableResponse<UserBenchmarkEntity>> {
    const username = (dto.username || 'user_100').replace(/'/g, "''");
    const startMs = performance.now();

    // RAW STRING CONCATENATION: Dynamic query text prevents PostgreSQL Prepared Statement Plan Cache!
    const rawSql = `SELECT id, username, email, age, status, created_at AS "createdAt" FROM benchmark_users WHERE username = '${username}';`;

    const data: UserBenchmarkEntity[] = await this.dataSource.query(rawSql);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    const explainAnalyzeSql = `EXPLAIN ANALYZE ${rawSql}`;

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs,
        strategy: 'RAW_STRING_CONCAT',
        scanType: 'Index Scan / Seq Scan',
        planCacheStatus: 'Cache Miss (Query tree parsed & compiled from scratch every execution)',
        queryExecuted: rawSql,
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: 'Dynamic Parsing (No Plan Cache)',
        },
      },
    };
  }
}
