import { Injectable } from '@nestjs/common';
import { EvaluateFeatureDto } from '../dto/evaluate-feature.dto';
import { FeatureEvaluationResult } from '../interfaces/traffic-engineering.interface';

@Injectable()
export class TrafficEngineeringNaiveService {
  async evaluateNaive(dto: EvaluateFeatureDto): Promise<FeatureEvaluationResult> {
    const startMs = performance.now();
    const flagName = dto.flagName || 'NEW_CHECKOUT_V2';
    const userId = dto.userId || 'USER_5521';

    // NAIVE HARDCODED BRANCHING: Static boolean check compiled directly into application code!
    // Any percentage adjustment or feature toggle requires full rebuild & deployment
    const featureEnabled = false; // Hardcoded default
    const variant = featureEnabled ? 'CANARY_V2' : 'LEGACY_V1';

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      flagName,
      userId,
      featureEnabled,
      variant,
      bucket: 0,
      shadowTrafficTriggered: false,
      performance: {
        executionTimeMs,
        strategy: 'HARDCODED_MONOLITHIC_BRANCHING',
        description: 'Hardcoded monolithic if/else branch; feature toggling or canary adjustments require server redeployments',
      },
    };
  }
}
