import { Module } from '@nestjs/common';
import { TrafficEngineeringNaiveService } from './services/traffic-engineering-naive.service';
import { TrafficEngineeringOptimizedService } from './services/traffic-engineering-optimized.service';
import { TrafficEngineeringNaiveController } from './controllers/traffic-engineering-naive.controller';
import { TrafficEngineeringOptimizedController } from './controllers/traffic-engineering-optimized.controller';

@Module({
  controllers: [TrafficEngineeringNaiveController, TrafficEngineeringOptimizedController],
  providers: [TrafficEngineeringNaiveService, TrafficEngineeringOptimizedService],
  exports: [TrafficEngineeringNaiveService, TrafficEngineeringOptimizedService],
})
export class TrafficEngineeringModule {}
