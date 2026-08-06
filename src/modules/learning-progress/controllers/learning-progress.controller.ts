import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { LearningProgressService } from '../services/learning-progress.service';
import { UpdateProgressDto } from '../dto/update-progress.dto';

@Controller('api/v1/learning-progress')
export class LearningProgressController {
  constructor(private readonly learningProgressService: LearningProgressService) {}

  @Get('summary')
  getSummary() {
    return this.learningProgressService.getSummary();
  }

  @Patch(':topicId')
  updateTopic(
    @Param('topicId') topicId: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.learningProgressService.updateTopic(topicId, updateProgressDto);
  }
}
