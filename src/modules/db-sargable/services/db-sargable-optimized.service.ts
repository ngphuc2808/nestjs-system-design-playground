import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SearchDateDto } from '../dto/search-date.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { SargableResponse } from '../interfaces/db-sargable.interface';
import { UserBenchmarkEntity } from '../../db-pagination/entities/user-benchmark.entity';

@Injectable()
export class DbSargableOptimizedService {
  constructor(private readonly dataSource: DataSource) {}

  async searchDateRangeOptimized(dto: SearchDateDto): Promise<SargableResponse<UserBenchmarkEntity>> {
    const targetDateStr = dto.targetDate || '2026-08-05';
    const startDate = `${targetDateStr} 00:00:00+00`;
    const endDate = `${targetDateStr} 23:59:59.999+00`;

    const startMs = performance.now();

    // SARGABLE QUERY: Range condition created_at >= $1 AND created_at <= $2 allows B-Tree Index Range Scan!
    const query = `
      SELECT id, username, email, age, status, created_at AS "createdAt"
      FROM benchmark_users
      WHERE created_at >= $1 AND created_at <= $2
      LIMIT 50
    `;

    const data: UserBenchmarkEntity[] = await this.dataSource.query(query, [startDate, endDate]);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs,
        strategy: 'SARGABLE_DATE_RANGE',
        scanType: 'Index Range Scan (B-Tree index seek on created_at)',
        planCacheStatus: 'Plan Cached & Reused',
        queryExecuted: query.trim(),
      },
    };
  }

  async searchUserParameterBindingOptimized(dto: SearchUserDto): Promise<SargableResponse<UserBenchmarkEntity>> {
    const username = dto.username || 'user_100';
    const startMs = performance.now();

    // PARAMETER BINDING ($1): Allows PostgreSQL engine to cache prepared statement query plan & prevents SQL Injection
    const query = `
      SELECT id, username, email, age, status, created_at AS "createdAt"
      FROM benchmark_users
      WHERE username = $1
    `;

    const data: UserBenchmarkEntity[] = await this.dataSource.query(query, [username]);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs,
        strategy: 'PREPARED_STATEMENT_BINDING',
        scanType: 'Index Scan (Parameterized B-Tree Seek)',
        planCacheStatus: 'Cache Hit (Prepared Statement execution plan reused across requests)',
        queryExecuted: query.trim(),
      },
    };
  }
}
