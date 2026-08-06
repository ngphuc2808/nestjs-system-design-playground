import { Body, Controller, Get, Post } from '@nestjs/common';
import { OutboxPatternOptimizedService } from '../services/outbox-pattern-optimized.service';
import { CreateOutboxOrderDto } from '../dto/create-outbox-order.dto';

@Controller('api/v1/outbox-pattern/optimized')
export class OutboxPatternOptimizedController {
  constructor(private readonly optimizedService: OutboxPatternOptimizedService) {}

  @Post('create-order')
  createOrderOptimized(@Body() dto: CreateOutboxOrderDto) {
    return this.optimizedService.createOrderOptimized(dto);
  }

  @Get('outbox-events')
  getOutboxEvents() {
    return this.optimizedService.getOutboxEvents();
  }

  @Post('relay/trigger')
  triggerOutboxRelay() {
    return this.optimizedService.triggerOutboxRelay();
  }
}
