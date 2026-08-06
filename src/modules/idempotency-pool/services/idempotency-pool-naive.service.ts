import { Injectable } from '@nestjs/common';
import { PaymentChargeDto } from '../dto/payment-charge.dto';
import { PaymentResponse } from '../interfaces/idempotency-pool.interface';

@Injectable()
export class IdempotencyPoolNaiveService {
  async chargePaymentNaive(dto: PaymentChargeDto, idempotencyKeyHeader?: string): Promise<PaymentResponse> {
    const startMs = performance.now();
    const amount = Number(dto.amount) || 199.99;
    const currency = dto.currency || 'USD';

    // NAIVE EXECUTION: Ignores x-idempotency-key header completely!
    // Every network retry generates a new charge and distinct transaction ID!
    const transactionId = `TX_NAIVE_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const chargedAt = new Date().toISOString();

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      success: true,
      transactionId,
      idempotencyKey: idempotencyKeyHeader || 'NONE_PROVIDED',
      amount,
      currency,
      chargedAt,
      cachedResponse: false,
      performance: {
        executionTimeMs,
        strategy: 'NON_IDEMPOTENT_DUPLICATE_CHARGE',
        description: 'Header x-idempotency-key ignored! Network retries caused secondary payment charge',
      },
    };
  }
}
