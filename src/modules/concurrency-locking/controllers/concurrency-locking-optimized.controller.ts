import { Body, Controller, Post } from '@nestjs/common';
import { ConcurrencyLockingOptimizedService } from '../services/concurrency-locking-optimized.service';
import { DeductStockDto } from '../dto/deduct-stock.dto';
import { SeedInventoryDto } from '../dto/seed-inventory.dto';

@Controller('api/v1/concurrency-locking')
export class ConcurrencyLockingOptimizedController {
  constructor(private readonly optimizedService: ConcurrencyLockingOptimizedService) {}

  @Post('optimized/deduct/optimistic')
  deductOptimistic(@Body() dto: DeductStockDto) {
    return this.optimizedService.deductOptimistic(dto);
  }

  @Post('optimized/deduct/pessimistic')
  deductPessimistic(@Body() dto: DeductStockDto) {
    return this.optimizedService.deductPessimistic(dto);
  }

  @Post('optimized/deduct/advisory')
  deductAdvisory(@Body() dto: DeductStockDto) {
    return this.optimizedService.deductAdvisory(dto);
  }

  @Post('seed')
  seedInventory(@Body() dto: SeedInventoryDto) {
    return this.optimizedService.seedInventory(dto);
  }
}
