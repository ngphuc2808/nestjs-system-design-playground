import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBenchmarkEntity } from './entities/user-benchmark.entity';
import { DbPaginationNaiveService } from './services/db-pagination-naive.service';
import { DbPaginationOptimizedService } from './services/db-pagination-optimized.service';
import { DbPaginationNaiveController } from './controllers/db-pagination-naive.controller';
import { DbPaginationOptimizedController } from './controllers/db-pagination-optimized.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserBenchmarkEntity])],
  controllers: [DbPaginationNaiveController, DbPaginationOptimizedController],
  providers: [DbPaginationNaiveService, DbPaginationOptimizedService],
  exports: [DbPaginationNaiveService, DbPaginationOptimizedService],
})
export class DbPaginationModule {}
