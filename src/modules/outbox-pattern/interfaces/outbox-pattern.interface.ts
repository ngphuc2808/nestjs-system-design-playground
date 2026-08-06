export interface OutboxPerformance {
  executionTimeMs: number;
  strategy: 'UNSAFE_DUAL_WRITE' | 'ATOMIC_TRANSACTIONAL_OUTBOX';
  description: string;
}

export interface OutboxOrderResult {
  success: boolean;
  orderId: string;
  orderNumber: string;
  amount: number;
  outboxEventId?: string;
  eventPublishedToBroker: boolean;
  performance: OutboxPerformance;
}

export interface RelayTriggerResult {
  processedCount: number;
  failedCount: number;
  remainingPendingCount: number;
  executionTimeMs: number;
}
