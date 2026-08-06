import { SqlDebugMetadata } from '../../../common/interfaces/sql-debug.interface';

export interface PaginationPerformance {
  executionTimeMs: number;
  strategy: 'NAIVE_OFFSET' | 'DEFERRED_JOIN' | 'KEYSET_CURSOR';
  scanType: string;
  totalRowsScannedEstimate: string;
  sqlDebug?: SqlDebugMetadata;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    page?: number;
    limit: number;
    totalCount?: number;
    nextCursor?: number | null;
    hasMore: boolean;
  };
  performance: PaginationPerformance;
}
