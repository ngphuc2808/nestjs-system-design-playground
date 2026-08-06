export interface LedgerPerformance {
  executionTimeMs: number;
  strategy: 'MUTABLE_IN_PLACE_UPDATE' | 'IMMUTABLE_SHA256_APPEND_ONLY' | 'CHAIN_INTEGRITY_VERIFICATION';
  description: string;
}

export interface VerificationResult {
  isValid: boolean;
  totalRecordsScanned: number;
  tamperedRecords: Array<{
    id: number;
    accountId: string;
    expectedHash: string;
    actualHash: string;
  }>;
  performance: LedgerPerformance;
}

export interface LedgerResponse<T> {
  data: T;
  performance: LedgerPerformance;
}
