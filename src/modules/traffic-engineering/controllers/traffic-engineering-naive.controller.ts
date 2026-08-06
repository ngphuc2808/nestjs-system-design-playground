import { Body, Controller, Post } from '@nestjs/common';
import { TrafficEngineeringNaiveService } from '../services/traffic-engineering-naive.service';
import { EvaluateFeatureDto } from '../dto/evaluate-feature.dto';

@Controller('api/v1/traffic-engineering/naive')
export class TrafficEngineeringNaiveController {
  constructor(private readonly naiveService: TrafficEngineeringNaiveService) {}

  @Post('evaluate')
  evaluateNaive(@Body() dto: EvaluateFeatureDto) {
    return this.naiveService.evaluateNaive(dto);
  }
}
