export interface KafkaPerformance {
  executionTimeMs: number;
  strategy: 'UNKEYED_RANDOM_ROUND_ROBIN' | 'KEY_BASED_PARTITION_ROUTING';
  description: string;
}

export interface ProduceEventResult {
  success: boolean;
  topic: string;
  partition: number;
  offset: string;
  orderId: string;
  eventType: string;
  key: string | null;
  performance: KafkaPerformance;
}

export interface ConsumerGroupStatus {
  groupId: string;
  topic: string;
  activePartitions: number[];
  autoCommitEnabled: boolean;
  consumedEventCount: number;
}
