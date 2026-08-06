import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitQueryDto } from '../dto/rate-limit-query.dto';
import { FlashSaleDeductDto } from '../dto/flash-sale-deduct.dto';
import { RateLimitResult, FlashSaleResult } from '../interfaces/redis-lua.interface';

@Injectable()
export class RedisLuaNaiveService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
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

  async rateLimitNaive(dto: RateLimitQueryDto): Promise<RateLimitResult> {
    const startMs = performance.now();
    const identifier = dto.identifier || 'user_101';
    const limit = Number(dto.limit) || 10;
    const windowSeconds = Number(dto.windowSeconds) || 60;
    const key = `naive:ratelimit:${identifier}`;

    // NAIVE NON-ATOMIC MULTI-STEP REDIS CALLS: Separate GET and SET commands over network
    const countStr = await this.redis.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;

    if (count >= limit) {
      const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
      return {
        allowed: false,
        key,
        currentCount: count,
        limit,
        windowSeconds,
        performance: {
          executionTimeMs,
          strategy: 'NON_ATOMIC_MULTIPLE_REDIS_CALLS',
          description: 'Non-atomic separate Redis GET command confirmed rate limit exceeded',
        },
      };
    }

    // Network race condition window: multiple concurrent calls read stale count!
    await new Promise((resolve) => setTimeout(resolve, 5));

    await this.redis.set(key, count + 1, 'EX', windowSeconds);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      allowed: true,
      key,
      currentCount: count + 1,
      limit,
      windowSeconds,
      performance: {
        executionTimeMs,
        strategy: 'NON_ATOMIC_MULTIPLE_REDIS_CALLS',
        description: 'Separate GET then SET commands caused race conditions under high RPS',
      },
    };
  }

  async deductFlashSaleNaive(dto: FlashSaleDeductDto): Promise<FlashSaleResult> {
    const startMs = performance.now();
    const productId = dto.productId || 'FLASH_IPHONE_16';
    const quantity = Number(dto.quantity) || 1;
    const key = `flash_sale:stock:${productId}`;

    // NAIVE FLASH SALE DEDUCTION: Separate GET then DECRBY commands
    const stockStr = await this.redis.get(key);

    if (!stockStr) {
      return {
        success: false,
        productId,
        remainingStock: 0,
        message: 'Product stock not initialized in Redis',
        performance: {
          executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
          strategy: 'NON_ATOMIC_MULTIPLE_REDIS_CALLS',
          description: 'Stock key missing',
        },
      };
    }

    const currentStock = parseInt(stockStr, 10);

    if (currentStock < quantity) {
      return {
        success: false,
        productId,
        remainingStock: currentStock,
        message: 'Sold out / Insufficient stock',
        performance: {
          executionTimeMs: Number((performance.now() - startMs).toFixed(3)),
          strategy: 'NON_ATOMIC_MULTIPLE_REDIS_CALLS',
          description: 'Separate GET check failed',
        },
      };
    }

    // Network delay exposing race window for overselling
    await new Promise((resolve) => setTimeout(resolve, 5));

    const remaining = await this.redis.decrby(key, quantity);
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      success: true,
      productId,
      remainingStock: remaining,
      message: `Naive flash sale deduction completed (Remaining: ${remaining}). High oversell risk!`,
      performance: {
        executionTimeMs,
        strategy: 'NON_ATOMIC_MULTIPLE_REDIS_CALLS',
        description: 'Separate Redis calls created oversell race conditions',
      },
    };
  }
}
