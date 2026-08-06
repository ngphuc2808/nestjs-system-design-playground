import { Body, Controller, Headers, Post } from '@nestjs/common';
import { IdempotencyPoolNaiveService } from '../services/idempotency-pool-naive.service';
import { PaymentChargeDto } from '../dto/payment-charge.dto';

@Controller('api/v1/idempotency-pool/naive')
export class IdempotencyPoolNaiveController {
  constructor(private readonly naiveService: IdempotencyPoolNaiveService) {}

  @Post('payment')
  chargePaymentNaive(@Body() dto: PaymentChargeDto, @Headers('x-idempotency-key') idempotencyKey?: string) {
    return this.naiveService.chargePaymentNaive(dto, idempotencyKey);
  }
}
