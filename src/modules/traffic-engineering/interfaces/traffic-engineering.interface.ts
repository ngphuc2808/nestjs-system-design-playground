export interface FeatureFlagRule {
  flagName: string;
  enabled: boolean;
  rolloutPercentage: number; // 0..100
  allowedUserIds?: string[];
  updatedAt: string;
}

export interface TrafficPerformance {
  executionTimeMs: number;
  strategy: 'HARDCODED_MONOLITHIC_BRANCHING' | 'DYNAMIC_REDIS_FEATURE_FLAG';
  description: string;
}

export interface FeatureEvaluationResult {
  flagName: string;
  userId: string;
  featureEnabled: boolean;
  variant: 'CANARY_V2' | 'LEGACY_V1';
  bucket: number;
  shadowTrafficTriggered: boolean;
  performance: TrafficPerformance;
}

export interface ShadowTrafficStatus {
  totalMirroredRequests: number;
  successfulShadowCalls: number;
  avgShadowLatencyMs: number;
}
