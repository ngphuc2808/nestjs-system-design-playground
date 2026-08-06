export interface RateLimitPerformance {
  executionTimeMs: number;
  strategy: 'NON_ATOMIC_MULTIPLE_REDIS_CALLS' | 'ATOMIC_REDIS_LUA_SLIDING_WINDOW';
  description: string;
}

export interface RateLimitResult {
  allowed: boolean;
  key: string;
  currentCount: number;
  limit: number;
  windowSeconds: number;
  performance: RateLimitPerformance;
}

export interface FlashSalePerformance {
  executionTimeMs: number;
  strategy: 'NON_ATOMIC_MULTIPLE_REDIS_CALLS' | 'ATOMIC_REDIS_LUA_DECRBY';
  description: string;
}

export interface FlashSaleResult {
  success: boolean;
  productId: string;
  remainingStock: number;
  message: string;
  performance: FlashSalePerformance;
}
