export interface EngineMetric {
  engine: 'Kafka' | 'RabbitMQ' | 'BullMQ';
  totalMessages: number;
  durationMs: number;
  throughputMsgSec: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  status: 'ONLINE' | 'SIMULATED_FALLBACK';
}

export interface SystemDesignTradeoff {
  engine: 'Kafka' | 'RabbitMQ' | 'BullMQ';
  primaryUseCase: string;
  orderingGuarantee: string;
  replayability: string;
  routingFlexibility: string;
  recommendedWhen: string;
}

export interface BenchmarkComparisonResult {
  messageCount: number;
  concurrency: number;
  executedAt: string;
  metrics: EngineMetric[];
  winnerThroughput: 'Kafka' | 'RabbitMQ' | 'BullMQ';
  winnerLatency: 'Kafka' | 'RabbitMQ' | 'BullMQ';
}
