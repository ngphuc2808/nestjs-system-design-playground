import { SqlDebugMetadata } from '../../../common/interfaces/sql-debug.interface';

export interface SargablePerformance {
  executionTimeMs: number;
  strategy: 'NON_SARGABLE_DATE_WRAP' | 'SARGABLE_DATE_RANGE' | 'RAW_STRING_CONCAT' | 'PREPARED_STATEMENT_BINDING';
  scanType: string;
  planCacheStatus: string;
  queryExecuted: string;
  sqlDebug?: SqlDebugMetadata;
}

export interface SargableResponse<T> {
  data: T[];
  count: number;
  performance: SargablePerformance;
}
