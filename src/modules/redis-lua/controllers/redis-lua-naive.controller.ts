import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RedisLuaNaiveService } from '../services/redis-lua-naive.service';
import { RateLimitQueryDto } from '../dto/rate-limit-query.dto';
import { FlashSaleDeductDto } from '../dto/flash-sale-deduct.dto';

@Controller('api/v1/redis-lua/naive')
export class RedisLuaNaiveController {
  constructor(private readonly naiveService: RedisLuaNaiveService) {}

  @Get('rate-limit')
  rateLimitNaive(@Query() dto: RateLimitQueryDto) {
    return this.naiveService.rateLimitNaive(dto);
  }

  @Post('flash-sale')
  deductFlashSaleNaive(@Body() dto: FlashSaleDeductDto) {
    return this.naiveService.deductFlashSaleNaive(dto);
  }
}
