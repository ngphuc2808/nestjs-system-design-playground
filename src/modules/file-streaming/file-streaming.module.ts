import { Module } from '@nestjs/common';
import { FileStreamingNaiveService } from './services/file-streaming-naive.service';
import { FileStreamingOptimizedService } from './services/file-streaming-optimized.service';
import { FileStreamingNaiveController } from './controllers/file-streaming-naive.controller';
import { FileStreamingOptimizedController } from './controllers/file-streaming-optimized.controller';

@Module({
  controllers: [FileStreamingNaiveController, FileStreamingOptimizedController],
  providers: [FileStreamingNaiveService, FileStreamingOptimizedService],
  exports: [FileStreamingNaiveService, FileStreamingOptimizedService],
})
export class FileStreamingModule {}
