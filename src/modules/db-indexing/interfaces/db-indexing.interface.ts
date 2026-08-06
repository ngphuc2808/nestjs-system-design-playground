import { SqlDebugMetadata } from '../../../common/interfaces/sql-debug.interface';

export interface IndexingPerformance {
  executionTimeMs: number;
  strategy: 'COVERING_INDEX_ONLY_SCAN' | 'PARTIAL_INDEX_SEEK' | 'LEFTMOST_PREFIX_SEEK' | 'GIN_JSONB_CONTAINMENT' | 'HEAP_SEQ_SCAN';
  scanType: string;
  sharedHitBlocks: number;
  sharedReadBlocks: number;
  explainPlanRaw?: any;
  sqlDebug?: SqlDebugMetadata;
}

export interface IndexingResponse<T> {
  data: T[];
  count: number;
  performance: IndexingPerformance;
}
