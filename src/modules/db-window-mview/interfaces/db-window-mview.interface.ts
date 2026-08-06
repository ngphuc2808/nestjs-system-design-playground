export interface AnalyticsPerformance {
  executionTimeMs: number;
  heapUsedMb: number;
  strategy: 'NAIVE_JS_ARRAY_AGGREGATION' | 'SQL_WINDOW_FUNCTIONS' | 'MATERIALIZED_VIEW_QUERY' | 'MATERIALIZED_VIEW_CONCURRENT_REFRESH';
  description: string;
}

export interface AnalyticsResponse<T> {
  data: T[];
  count: number;
  performance: AnalyticsPerformance;
}
