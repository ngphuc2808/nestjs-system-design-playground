import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import * as fs from 'fs';
import * as path from 'path';
import { RateLimitQueryDto } from '../dto/rate-limit-query.dto';
import { FlashSaleDeductDto } from '../dto/flash-sale-deduct.dto';
import { SeedFlashSaleDto } from '../dto/seed-flash-sale.dto';
import { RateLimitResult, FlashSaleResult } from '../interfaces/redis-lua.interface';

@Injectable()
export class RedisLuaOptimizedService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly slidingWindowLuaScript: string;
  private readonly flashSaleDeductLuaScript: string;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      lazyConnect: true,
    });
    this.redis.connect().catch(() => {});

    const distLuaDir = path.join(__dirname, '..', 'lua');
    const srcLuaDir = path.join(process.cwd(), 'src', 'modules', 'redis-lua', 'lua');
    
    const slidingWindowFile = fs.existsSync(path.join(distLuaDir, 'sliding-window.lua'))
      ? path.join(distLuaDir, 'sliding-window.lua')
      : path.join(srcLuaDir, 'sliding-window.lua');

    const flashSaleFile = fs.existsSync(path.join(distLuaDir, 'flash-sale-deduct.lua'))
      ? path.join(distLuaDir, 'flash-sale-deduct.lua')
      : path.join(srcLuaDir, 'flash-sale-deduct.lua');

    const defaultSlidingLua = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local windowMs = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])
      local memberId = ARGV[4]
      local clearBefore = now - windowMs

      redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
      local currentCount = redis.call('ZCARD', key)

      if currentCount < limit then
        redis.call('ZADD', key, now, memberId)
        redis.call('PEXPIRE', key, windowMs)
        return {1, currentCount + 1}
      else
        return {0, currentCount}
      end
    `;

    const defaultFlashLua = `
      local key = KEYS[1]
      local quantity = tonumber(ARGV[1])
      local currentStockStr = redis.call('GET', key)

      if not currentStockStr then
        return -2
      end

      local currentStock = tonumber(currentStockStr)
      if currentStock < quantity then
        return -1
      end

      local remaining = redis.call('DECRBY', key, quantity)
      return remaining
    `;

    this.slidingWindowLuaScript = fs.existsSync(slidingWindowFile)
      ? fs.readFileSync(slidingWindowFile, 'utf8')
      : defaultSlidingLua;

    this.flashSaleDeductLuaScript = fs.existsSync(flashSaleFile)
      ? fs.readFileSync(flashSaleFile, 'utf8')
      : defaultFlashLua;
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async rateLimitOptimized(dto: RateLimitQueryDto): Promise<RateLimitResult> {
    const startMs = performance.now();
    const identifier = dto.identifier || 'user_101';
    const limit = Number(dto.limit) || 10;
    const windowSeconds = Number(dto.windowSeconds) || 60;
    const windowMs = windowSeconds * 1000;
    const key = `opt:ratelimit:${identifier}`;
    const now = Date.now();
    const memberId = `${now}-${Math.random()}`;

    // ATOMIC REDIS LUA SCRIPT: Executes Sliding Window Log rate limit in a single thread inside Redis
    const result = (await this.redis.eval(
      this.slidingWindowLuaScript,
      1,
      key,
      now.toString(),
      windowMs.toString(),
      limit.toString(),
      memberId,
    )) as [number, number];

    const allowed = result[0] === 1;
    const currentCount = result[1];
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      allowed,
      key,
      currentCount,
      limit,
      windowSeconds,
      performance: {
        executionTimeMs,
        strategy: 'ATOMIC_REDIS_LUA_SLIDING_WINDOW',
        description: 'Single atomic Redis Lua script managed Sorted Set ZSET sliding window with zero race conditions',
      },
    };
  }

  async deductFlashSaleOptimized(dto: FlashSaleDeductDto): Promise<FlashSaleResult> {
    const startMs = performance.now();
    const productId = dto.productId || 'FLASH_IPHONE_16';
    const quantity = Number(dto.quantity) || 1;
    const key = `flash_sale:stock:${productId}`;

    // ATOMIC REDIS LUA FLASH SALE DEDUCTION: Stock check + DECRBY in 1 single atomic Redis execution step
    const result = (await this.redis.eval(
      this.flashSaleDeductLuaScript,
      1,
      key,
      quantity.toString(),
    )) as number;

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    if (result === -2) {
      return {
        success: false,
        productId,
        remainingStock: 0,
        message: 'Product stock not initialized. Run POST /seed first!',
        performance: {
          executionTimeMs,
          strategy: 'ATOMIC_REDIS_LUA_DECRBY',
          description: 'Stock key missing',
        },
      };
    }

    if (result === -1) {
      return {
        success: false,
        productId,
        remainingStock: 0,
        message: 'Flash sale item SOLD OUT! (Guaranteed 0 overselling by atomic Lua script)',
        performance: {
          executionTimeMs,
          strategy: 'ATOMIC_REDIS_LUA_DECRBY',
          description: 'Atomic Lua script prevented overselling when stock fell below 0',
        },
      };
    }

    return {
      success: true,
      productId,
      remainingStock: result,
      message: `Atomic flash sale deduction succeeded (Remaining stock: ${result})`,
      performance: {
        executionTimeMs,
        strategy: 'ATOMIC_REDIS_LUA_DECRBY',
        description: 'Atomic DECRBY + bounds check in Redis Lua executed in sub-millisecond latency',
      },
    };
  }

  async seedFlashSale(dto: SeedFlashSaleDto): Promise<{ message: string; productId: string; initialStock: number }> {
    const productId = dto.productId || 'FLASH_IPHONE_16';
    const initialStock = Number(dto.initialStock) || 1000;
    const key = `flash_sale:stock:${productId}`;

    await this.redis.set(key, initialStock.toString());

    return {
      message: `Successfully seeded Redis flash sale stock for ${productId} to ${initialStock} units`,
      productId,
      initialStock,
    };
  }
}
