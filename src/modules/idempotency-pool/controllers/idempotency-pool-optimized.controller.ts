import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IdempotencyPoolOptimizedService } from '../services/idempotency-pool-optimized.service';
import { PaymentChargeDto } from '../dto/payment-charge.dto';

@Controller('api/v1/idempotency-pool/optimized')
export class IdempotencyPoolOptimizedController {
  constructor(private readonly optimizedService: IdempotencyPoolOptimizedService) {}

  @Post('payment')
  async chargePaymentOptimized(
    @Body() dto: PaymentChargeDto,
    @Headers('x-idempotency-key') idempotencyKey: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.optimizedService.chargePaymentOptimized(dto, idempotencyKey);
    if (result.cachedResponse) {
      res.setHeader('x-cache', 'HIT');
    } else {
      res.setHeader('x-cache', 'MISS');
    }
    return result;
  }

  @Get('pool-status')
  getPoolStatus() {
    return this.optimizedService.getPoolStatus();
  }
}
