import { Module } from '@nestjs/common';
import { IdempotencyPoolNaiveService } from './services/idempotency-pool-naive.service';
import { IdempotencyPoolOptimizedService } from './services/idempotency-pool-optimized.service';
import { IdempotencyPoolNaiveController } from './controllers/idempotency-pool-naive.controller';
import { IdempotencyPoolOptimizedController } from './controllers/idempotency-pool-optimized.controller';

@Module({
  controllers: [IdempotencyPoolNaiveController, IdempotencyPoolOptimizedController],
  providers: [IdempotencyPoolNaiveService, IdempotencyPoolOptimizedService],
  exports: [IdempotencyPoolNaiveService, IdempotencyPoolOptimizedService],
})
export class IdempotencyPoolModule {}
