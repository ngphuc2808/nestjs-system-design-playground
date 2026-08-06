import { Module } from '@nestjs/common';
import { DbWindowMviewNaiveService } from './services/db-window-mview-naive.service';
import { DbWindowMviewOptimizedService } from './services/db-window-mview-optimized.service';
import { DbWindowMviewNaiveController } from './controllers/db-window-mview-naive.controller';
import { DbWindowMviewOptimizedController } from './controllers/db-window-mview-optimized.controller';

@Module({
  controllers: [DbWindowMviewNaiveController, DbWindowMviewOptimizedController],
  providers: [DbWindowMviewNaiveService, DbWindowMviewOptimizedService],
  exports: [DbWindowMviewNaiveService, DbWindowMviewOptimizedService],
})
export class DbWindowMviewModule {}
