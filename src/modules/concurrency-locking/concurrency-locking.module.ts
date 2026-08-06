import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductInventoryEntity } from './entities/product-inventory.entity';
import { ConcurrencyLockingNaiveService } from './services/concurrency-locking-naive.service';
import { ConcurrencyLockingOptimizedService } from './services/concurrency-locking-optimized.service';
import { ConcurrencyLockingNaiveController } from './controllers/concurrency-locking-naive.controller';
import { ConcurrencyLockingOptimizedController } from './controllers/concurrency-locking-optimized.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductInventoryEntity])],
  controllers: [ConcurrencyLockingNaiveController, ConcurrencyLockingOptimizedController],
  providers: [ConcurrencyLockingNaiveService, ConcurrencyLockingOptimizedService],
  exports: [ConcurrencyLockingNaiveService, ConcurrencyLockingOptimizedService],
})
export class ConcurrencyLockingModule {}
