import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagingComparisonOptimizedService } from '../services/messaging-comparison-optimized.service';
import { BenchmarkRunDto } from '../dto/benchmark-run.dto';

@Controller('api/v1/messaging-comparison/optimized')
export class MessagingComparisonOptimizedController {
  constructor(private readonly optimizedService: MessagingComparisonOptimizedService) {}

  @Post('benchmark')
  runBenchmark(@Body() dto: BenchmarkRunDto) {
    return this.optimizedService.runBenchmark(dto);
  }

  @Get('comparison-matrix')
  getComparisonMatrix() {
    return this.optimizedService.getComparisonMatrix();
  }
}
