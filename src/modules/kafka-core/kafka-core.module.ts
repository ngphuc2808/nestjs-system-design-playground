import { Module } from '@nestjs/common';
import { KafkaCoreNaiveService } from './services/kafka-core-naive.service';
import { KafkaCoreOptimizedService } from './services/kafka-core-optimized.service';
import { KafkaCoreNaiveController } from './controllers/kafka-core-naive.controller';
import { KafkaCoreOptimizedController } from './controllers/kafka-core-optimized.controller';

@Module({
  controllers: [KafkaCoreNaiveController, KafkaCoreOptimizedController],
  providers: [KafkaCoreNaiveService, KafkaCoreOptimizedService],
  exports: [KafkaCoreNaiveService, KafkaCoreOptimizedService],
})
export class KafkaCoreModule {}
