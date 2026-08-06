import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RedisLuaOptimizedService } from '../services/redis-lua-optimized.service';
import { RateLimitQueryDto } from '../dto/rate-limit-query.dto';
import { FlashSaleDeductDto } from '../dto/flash-sale-deduct.dto';
import { SeedFlashSaleDto } from '../dto/seed-flash-sale.dto';

@Controller('api/v1/redis-lua')
export class RedisLuaOptimizedController {
  constructor(private readonly optimizedService: RedisLuaOptimizedService) {}

  @Get('optimized/rate-limit')
  rateLimitOptimized(@Query() dto: RateLimitQueryDto) {
    return this.optimizedService.rateLimitOptimized(dto);
  }

  @Post('optimized/flash-sale')
  deductFlashSaleOptimized(@Body() dto: FlashSaleDeductDto) {
    return this.optimizedService.deductFlashSaleOptimized(dto);
  }

  @Post('seed')
  seedFlashSale(@Body() dto: SeedFlashSaleDto) {
    return this.optimizedService.seedFlashSale(dto);
  }
}
