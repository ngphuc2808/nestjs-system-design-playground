import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SearchIndexingOrderDto } from '../dto/search-indexing-order.dto';
import { IndexingResponse } from '../interfaces/db-indexing.interface';
import { IndexingOrderEntity } from '../entities/indexing-order.entity';

@Injectable()
export class DbIndexingNaiveService {
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

  async getLeftmostNaive(dto: SearchIndexingOrderDto): Promise<IndexingResponse<IndexingOrderEntity>> {
    const createdAfter = dto.createdAfter || '2026-08-01 00:00:00+00';

    // VIOLATES LEFTMOST PREFIX RULE: Query searches trailing `created_at` without leading `status` column!
    const query = `SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt" FROM benchmark_indexing_orders WHERE created_at >= $1 LIMIT 50`;

    const explain = await this.parseExplainPlan(query, [createdAfter]);
    const data: IndexingOrderEntity[] = await this.dataSource.query(query, [createdAfter]);

    const rawSql = `SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt" FROM benchmark_indexing_orders WHERE created_at >= '${createdAfter}' LIMIT 50;`;
    const explainAnalyzeSql = `EXPLAIN ANALYZE ${rawSql}`;

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs: explain.executionTimeMs,
        strategy: 'HEAP_SEQ_SCAN',
        scanType: `${explain.scanType} (Violates Composite Index Leftmost Prefix Rule)`,
        sharedHitBlocks: explain.sharedHitBlocks,
        sharedReadBlocks: explain.sharedReadBlocks,
        explainPlanRaw: explain.raw,
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: `${explain.scanType} (Full Table Seq Scan)`,
        },
      },
    };
  }

  async getGinJsonbNaive(dto: SearchIndexingOrderDto): Promise<IndexingResponse<IndexingOrderEntity>> {
    const category = dto.category || 'ELECTRONICS';

    // NON-GIN JSONB SEARCH: Casting JSONB to text forces full table Seq Scan!
    const query = `SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt", metadata FROM benchmark_indexing_orders WHERE metadata::text LIKE $1 LIMIT 50`;

    const searchParam = `%${category}%`;
    const explain = await this.parseExplainPlan(query, [searchParam]);
    const data: IndexingOrderEntity[] = await this.dataSource.query(query, [searchParam]);

    const rawSql = `SELECT id, user_id AS "userId", status, total_amount AS "totalAmount", created_at AS "createdAt", metadata FROM benchmark_indexing_orders WHERE metadata::text LIKE '%${category}%' LIMIT 50;`;
    const explainAnalyzeSql = `EXPLAIN ANALYZE ${rawSql}`;

    return {
      data,
      count: data.length,
      performance: {
        executionTimeMs: explain.executionTimeMs,
        strategy: 'HEAP_SEQ_SCAN',
        scanType: `${explain.scanType} (metadata::text LIKE forces Seq Scan instead of GIN index)`,
        sharedHitBlocks: explain.sharedHitBlocks,
        sharedReadBlocks: explain.sharedReadBlocks,
        explainPlanRaw: explain.raw,
        sqlDebug: {
          rawSql,
          explainAnalyzeSql,
          scanType: `${explain.scanType} (JSONB Text Casting Seq Scan)`,
        },
      },
    };
  }
}
