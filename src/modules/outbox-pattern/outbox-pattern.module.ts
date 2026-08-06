import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxOrderEntity } from './entities/outbox-order.entity';
import { OutboxEventEntity } from './entities/outbox-event.entity';
import { OutboxPatternNaiveService } from './services/outbox-pattern-naive.service';
import { OutboxPatternOptimizedService } from './services/outbox-pattern-optimized.service';
import { OutboxPatternNaiveController } from './controllers/outbox-pattern-naive.controller';
import { OutboxPatternOptimizedController } from './controllers/outbox-pattern-optimized.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OutboxOrderEntity, OutboxEventEntity])],
  controllers: [OutboxPatternNaiveController, OutboxPatternOptimizedController],
  providers: [OutboxPatternNaiveService, OutboxPatternOptimizedService],
  exports: [OutboxPatternNaiveService, OutboxPatternOptimizedService],
})
export class OutboxPatternModule {}
