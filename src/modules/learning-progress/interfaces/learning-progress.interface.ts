export enum TopicStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface PerformanceBenchmark {
  naiveLatencyMs: number | null;
  optimizedLatencyMs: number | null;
  naiveRps: number | null;
  optimizedRps: number | null;
  latencyImprovementPercentage?: string;
  rpsImprovementFactor?: string;
}

export interface LearningTopic {
  id: string;
  phase: string;
  moduleCode: string;
  title: string;
  description: string;
  status: TopicStatus;
  keyTakeaways: string[];
  benchmark: PerformanceBenchmark;
  updatedAt: string;
}

export interface LearningProgressSummary {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  todoTopics: number;
  overallProgressPercentage: string;
  topics: LearningTopic[];
}
