export interface IdempotencyPerformance {
  executionTimeMs: number;
  strategy: 'NON_IDEMPOTENT_DUPLICATE_CHARGE' | 'IDEMPOTENT_KEY_REDIS_LOCK' | 'IDEMPOTENT_CACHE_HIT';
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  idempotencyKey?: string;
  amount: number;
  currency: string;
  chargedAt: string;
  cachedResponse: boolean;
  performance: IdempotencyPerformance;
}

export interface ConnectionPoolStatus {
  totalConnections: number;
  idleConnections: number;
  waitingClients: number;
  maxPoolSize: number;
  healthy: boolean;
}
