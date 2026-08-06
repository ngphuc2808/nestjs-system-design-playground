import { Body, Controller, Post } from '@nestjs/common';
import { MessagingComparisonNaiveService } from '../services/messaging-comparison-naive.service';
import { PublishMessageDto } from '../dto/benchmark-run.dto';

@Controller('api/v1/messaging-comparison/naive')
export class MessagingComparisonNaiveController {
  constructor(private readonly naiveService: MessagingComparisonNaiveService) {}

  @Post('publish')
  publishNaive(@Body() dto: PublishMessageDto) {
    return this.naiveService.publishNaive(dto);
  }
}
