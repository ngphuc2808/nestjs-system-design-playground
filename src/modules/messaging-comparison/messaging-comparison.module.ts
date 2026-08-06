import { Module } from '@nestjs/common';
import { MessagingComparisonNaiveService } from './services/messaging-comparison-naive.service';
import { MessagingComparisonOptimizedService } from './services/messaging-comparison-optimized.service';
import { MessagingComparisonNaiveController } from './controllers/messaging-comparison-naive.controller';
import { MessagingComparisonOptimizedController } from './controllers/messaging-comparison-optimized.controller';

@Module({
  controllers: [MessagingComparisonNaiveController, MessagingComparisonOptimizedController],
  providers: [MessagingComparisonNaiveService, MessagingComparisonOptimizedService],
  exports: [MessagingComparisonNaiveService, MessagingComparisonOptimizedService],
})
export class MessagingComparisonModule {}
