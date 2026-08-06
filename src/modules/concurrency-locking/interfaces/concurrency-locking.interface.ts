export interface DeductionPerformance {
  executionTimeMs: number;
  strategy: 'UNPROTECTED_READ_MODIFY_WRITE' | 'OPTIMISTIC_OCC_VERSION' | 'PESSIMISTIC_FOR_UPDATE' | 'POSTGRES_ADVISORY_LOCK';
  description: string;
}

export interface DeductionResult {
  success: boolean;
  productId: number;
  remainingStock: number;
  version?: number;
  message: string;
  performance: DeductionPerformance;
}
