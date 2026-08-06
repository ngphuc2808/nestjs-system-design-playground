import { Injectable, BadRequestException, ConflictException, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';
import { PaymentChargeDto } from '../dto/payment-charge.dto';
import { PaymentResponse, ConnectionPoolStatus } from '../interfaces/idempotency-pool.interface';

@Injectable()
export class IdempotencyPoolOptimizedService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(private readonly dataSource: DataSource) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      lazyConnect: true,
    });
    this.redis.connect().catch(() => {});
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async chargePaymentOptimized(dto: PaymentChargeDto, idempotencyKey?: string): Promise<PaymentResponse> {
    const startMs = performance.now();

    if (!idempotencyKey || idempotencyKey.trim() === '') {
      throw new BadRequestException('Header "x-idempotency-key" is required for idempotent payment processing');
    }

    const cleanKey = idempotencyKey.trim();
    const lockKey = `idempotency:lock:${cleanKey}`;
    const resultKey = `idempotency:result:${cleanKey}`;

    // 1. CHECK FOR CACHED COMPLETED RESPONSE (IDEMPOTENT HIT)
    const cachedResultJson = await this.redis.get(resultKey);
    if (cachedResultJson) {
      const cachedResponse: PaymentResponse = JSON.parse(cachedResultJson);
      const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

      return {
        ...cachedResponse,
        cachedResponse: true,
        performance: {
          executionTimeMs,
          strategy: 'IDEMPOTENT_CACHE_HIT',
          description: 'Instant response returned from Redis Idempotency Result Cache; zero double-charging',
        },
      };
    }

    // 2. ATOMIC REDIS LOCK FOR IN-FLIGHT REQUEST (SET NX EX 30)
    const lockAcquired = await this.redis.set(lockKey, 'PROCESSING', 'EX', 30, 'NX');
    if (!lockAcquired) {
      throw new ConflictException('A request with this x-idempotency-key is currently processing. Please wait.');
    }

    try {
      // Execute payment charge transaction
      const amount = Number(dto.amount) || 199.99;
      const currency = dto.currency || 'USD';
      const transactionId = `TX_OPT_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const chargedAt = new Date().toISOString();

      // Simulate payment processor processing time
      await new Promise((resolve) => setTimeout(resolve, 50));

      const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

      const responsePayload: PaymentResponse = {
        success: true,
        transactionId,
        idempotencyKey: cleanKey,
        amount,
        currency,
        chargedAt,
        cachedResponse: false,
        performance: {
          executionTimeMs,
          strategy: 'IDEMPOTENT_KEY_REDIS_LOCK',
          description: 'Payment executed once; response cached in Redis for 24 hours',
        },
      };

      // 3. STORE COMPLETED RESPONSE IN REDIS WITH 24-HOUR TTL
      await this.redis.set(resultKey, JSON.stringify(responsePayload), 'EX', 86400);

      return responsePayload;
    } finally {
      // Release in-flight lock
      await this.redis.del(lockKey);
    }
  }

  async getPoolStatus(): Promise<ConnectionPoolStatus> {
    const driver = this.dataSource.driver as any;
    const pool = driver.master || driver.postgres;

    const totalConnections = pool?.totalCount || pool?.pool?.size || 10;
    const idleConnections = pool?.idleCount || pool?.pool?.available || 5;
    const waitingClients = pool?.waitingCount || pool?.pool?.pending || 0;
    const maxPoolSize = pool?.options?.max || 20;

    return {
      totalConnections,
      idleConnections,
      waitingClients,
      maxPoolSize,
      healthy: waitingClients === 0,
    };
  }
}
