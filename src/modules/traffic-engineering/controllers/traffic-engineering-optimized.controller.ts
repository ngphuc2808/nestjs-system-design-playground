import { Body, Controller, Get, Post } from '@nestjs/common';
import { TrafficEngineeringOptimizedService } from '../services/traffic-engineering-optimized.service';
import { EvaluateFeatureDto } from '../dto/evaluate-feature.dto';
import { ToggleFlagDto } from '../dto/toggle-flag.dto';

@Controller('api/v1/traffic-engineering')
export class TrafficEngineeringOptimizedController {
  constructor(private readonly optimizedService: TrafficEngineeringOptimizedService) {}

  @Post('optimized/evaluate')
  evaluateOptimized(@Body() dto: EvaluateFeatureDto) {
    return this.optimizedService.evaluateOptimized(dto);
  }

  @Post('flags/toggle')
  toggleFlag(@Body() dto: ToggleFlagDto) {
    return this.optimizedService.toggleFlag(dto);
  }

  @Get('shadow-traffic/status')
  getShadowStatus() {
    return this.optimizedService.getShadowStatus();
  }
}
