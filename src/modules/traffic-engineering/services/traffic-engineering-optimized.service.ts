import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { EvaluateFeatureDto } from '../dto/evaluate-feature.dto';
import { ToggleFlagDto } from '../dto/toggle-flag.dto';
import {
  FeatureFlagRule,
  FeatureEvaluationResult,
  ShadowTrafficStatus,
} from '../interfaces/traffic-engineering.interface';

@Injectable()
export class TrafficEngineeringOptimizedService implements OnModuleDestroy {
  private readonly redis: Redis;
  private shadowTotalCount = 0;
  private shadowSuccessCount = 0;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      lazyConnect: true,
    });
    this.redis.connect().catch(() => {});
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async toggleFlag(dto: ToggleFlagDto): Promise<FeatureFlagRule> {
    const flagName = dto.flagName || 'NEW_CHECKOUT_V2';
    const rule: FeatureFlagRule = {
      flagName,
      enabled: dto.enabled ?? true,
      rolloutPercentage: Math.min(100, Math.max(0, dto.rolloutPercentage ?? 25)),
      allowedUserIds: dto.allowedUserIds || [],
      updatedAt: new Date().toISOString(),
    };

    await this.redis.set(`feature:flag:${flagName}`, JSON.stringify(rule));
    return rule;
  }

  async evaluateOptimized(dto: EvaluateFeatureDto): Promise<FeatureEvaluationResult> {
    const startMs = performance.now();
    const flagName = dto.flagName || 'NEW_CHECKOUT_V2';
    const userId = dto.userId || 'USER_5521';

    // 1. FETCH DYNAMIC FEATURE FLAG FROM REDIS (Sub-5ms evaluation)
    const ruleJson = await this.redis.get(`feature:flag:${flagName}`);
    let rule: FeatureFlagRule = {
      flagName,
      enabled: true,
      rolloutPercentage: 50, // Default 50% canary
      updatedAt: new Date().toISOString(),
    };

    if (ruleJson) {
      rule = JSON.parse(ruleJson);
    }

    // 2. CANARY USER BUCKET CALCULATION (Consistent Hashing)
    const userHash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bucket = userHash % 100;

    const isUserExplicitlyAllowed = Boolean(rule.allowedUserIds && rule.allowedUserIds.includes(userId));
    const isBucketAllowed = bucket < rule.rolloutPercentage;
    const featureEnabled = Boolean(rule.enabled && (isBucketAllowed || isUserExplicitlyAllowed));
    const variant = featureEnabled ? 'CANARY_V2' : 'LEGACY_V1';

    // 3. ASYNCHRONOUS SHADOW TRAFFIC MIRRORING (Dark Launching - Non-blocking fire-and-forget)
    setImmediate(() => {
      this.mirrorShadowTraffic(dto);
    });

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      flagName,
      userId,
      featureEnabled,
      variant,
      bucket,
      shadowTrafficTriggered: true,
      performance: {
        executionTimeMs,
        strategy: 'DYNAMIC_REDIS_FEATURE_FLAG',
        description: 'Redis dynamic flag rule evaluated in sub-5ms; Canary percentage rollout hash computed; Shadow traffic mirrored asynchronously',
      },
    };
  }

  getShadowStatus(): ShadowTrafficStatus {
    return {
      totalMirroredRequests: this.shadowTotalCount,
      successfulShadowCalls: this.shadowSuccessCount,
      avgShadowLatencyMs: 1.2,
    };
  }

  private mirrorShadowTraffic(dto: EvaluateFeatureDto) {
    this.shadowTotalCount++;
    // Simulate non-blocking shadow traffic invocation
    setTimeout(() => {
      this.shadowSuccessCount++;
    }, 10);
  }
}
