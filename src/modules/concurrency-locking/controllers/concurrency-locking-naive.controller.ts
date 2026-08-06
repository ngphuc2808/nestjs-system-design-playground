import { Body, Controller, Post } from '@nestjs/common';
import { ConcurrencyLockingNaiveService } from '../services/concurrency-locking-naive.service';
import { DeductStockDto } from '../dto/deduct-stock.dto';

@Controller('api/v1/concurrency-locking/naive')
export class ConcurrencyLockingNaiveController {
  constructor(private readonly naiveService: ConcurrencyLockingNaiveService) {}

  @Post('deduct')
  deductNaive(@Body() dto: DeductStockDto) {
    return this.naiveService.deductNaive(dto);
  }
}
