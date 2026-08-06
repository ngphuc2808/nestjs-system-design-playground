import { Module } from '@nestjs/common';
import { LearningProgressController } from './controllers/learning-progress.controller';
import { LearningProgressService } from './services/learning-progress.service';

@Module({
  controllers: [LearningProgressController],
  providers: [LearningProgressService],
  exports: [LearningProgressService],
})
export class LearningProgressModule {}
