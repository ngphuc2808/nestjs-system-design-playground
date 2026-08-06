import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbIndexingOptimizedService } from '../services/db-indexing-optimized.service';
import { SearchIndexingOrderDto } from '../dto/search-indexing-order.dto';
import { SeedIndexingOrdersDto } from '../dto/seed-indexing-orders.dto';

@Controller('api/v1/db-indexing')
export class DbIndexingOptimizedController {
  constructor(private readonly optimizedService: DbIndexingOptimizedService) {}

  @Get('optimized/leftmost')
  getLeftmostOptimized(@Query() dto: SearchIndexingOrderDto) {
    return this.optimizedService.getLeftmostOptimized(dto);
  }

  @Get('optimized/gin-jsonb')
  getGinJsonbOptimized(@Query() dto: SearchIndexingOrderDto) {
    return this.optimizedService.getGinJsonbOptimized(dto);
  }

  @Get('optimized/partial')
  getPartialOptimized(@Query() dto: SearchIndexingOrderDto) {
    return this.optimizedService.getPartialOptimized(dto);
  }

  @Post('seed')
  seedIndexingOrders(@Body() dto: SeedIndexingOrdersDto) {
    return this.optimizedService.seedIndexingOrders(dto);
  }
}
