import { Body, Controller, Post } from '@nestjs/common';
import { OutboxPatternNaiveService } from '../services/outbox-pattern-naive.service';
import { CreateOutboxOrderDto } from '../dto/create-outbox-order.dto';

@Controller('api/v1/outbox-pattern/naive')
export class OutboxPatternNaiveController {
  constructor(private readonly naiveService: OutboxPatternNaiveService) {}

  @Post('create-order')
  createOrderNaive(@Body() dto: CreateOutboxOrderDto) {
    return this.naiveService.createOrderNaive(dto);
  }
}
