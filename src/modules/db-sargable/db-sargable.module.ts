import { Module } from '@nestjs/common';
import { DbSargableNaiveService } from './services/db-sargable-naive.service';
import { DbSargableOptimizedService } from './services/db-sargable-optimized.service';
import { DbSargableNaiveController } from './controllers/db-sargable-naive.controller';
import { DbSargableOptimizedController } from './controllers/db-sargable-optimized.controller';

@Module({
  controllers: [DbSargableNaiveController, DbSargableOptimizedController],
  providers: [DbSargableNaiveService, DbSargableOptimizedService],
  exports: [DbSargableNaiveService, DbSargableOptimizedService],
})
export class DbSargableModule {}
