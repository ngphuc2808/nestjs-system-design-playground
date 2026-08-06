import { Body, Controller, Post } from '@nestjs/common';
import { KafkaCoreNaiveService } from '../services/kafka-core-naive.service';
import { ProduceOrderEventDto } from '../dto/produce-order-event.dto';

@Controller('api/v1/kafka-core/naive')
export class KafkaCoreNaiveController {
  constructor(private readonly naiveService: KafkaCoreNaiveService) {}

  @Post('produce')
  produceNaive(@Body() dto: ProduceOrderEventDto) {
    return this.naiveService.produceNaive(dto);
  }
}
