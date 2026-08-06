import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexingOrderEntity } from './entities/indexing-order.entity';
import { DbIndexingNaiveService } from './services/db-indexing-naive.service';
import { DbIndexingOptimizedService } from './services/db-indexing-optimized.service';
import { DbIndexingNaiveController } from './controllers/db-indexing-naive.controller';
import { DbIndexingOptimizedController } from './controllers/db-indexing-optimized.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IndexingOrderEntity])],
  controllers: [DbIndexingNaiveController, DbIndexingOptimizedController],
  providers: [DbIndexingNaiveService, DbIndexingOptimizedService],
  exports: [DbIndexingNaiveService, DbIndexingOptimizedService],
})
export class DbIndexingModule {}
