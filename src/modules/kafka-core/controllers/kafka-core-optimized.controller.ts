import { Body, Controller, Get, Post } from '@nestjs/common';
import { KafkaCoreOptimizedService } from '../services/kafka-core-optimized.service';
import { ProduceOrderEventDto } from '../dto/produce-order-event.dto';

@Controller('api/v1/kafka-core/optimized')
export class KafkaCoreOptimizedController {
  constructor(private readonly optimizedService: KafkaCoreOptimizedService) {}

  @Post('produce')
  produceOptimized(@Body() dto: ProduceOrderEventDto) {
    return this.optimizedService.produceOptimized(dto);
  }

  @Get('consumer-status')
  getConsumerStatus() {
    return this.optimizedService.getConsumerStatus();
  }
}
