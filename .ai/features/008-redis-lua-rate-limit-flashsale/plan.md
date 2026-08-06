---
feature: "008-redis-lua-rate-limit-flashsale"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — redis-lua-rate-limit-flashsale

## 1. Overview & Architecture Approach
Module 2.2 (High-Throughput Rate Limiting & Flash Sale Stock Deduction with Atomic Redis Lua Scripts) demonstrates ultra-low-latency in-memory rate limiting and oversell prevention:
1. **Non-Atomic Multi-Step Network Calls (`naive`)**: Executing `redis.get()` followed by `redis.set()` over separate network round-trips, causing race conditions and inaccurate limit enforcement under high concurrency.
2. **Atomic Sliding Window Rate Limiter Lua Script (`optimized`)**: Utilizing a single Lua script managing Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`) to execute sliding window rate limiting in sub-millisecond execution time.
3. **Atomic Flash Sale Inventory Deduction Lua Script (`optimized`)**: Executing atomic `DECRBY` with instant bounds checking (`stock < 0` rollback) in Redis memory, offloading 100,000+ RPS flash sale order bursts away from PostgreSQL.

## 2. Components & Files Touched
- `src/modules/redis-lua/dto/`: DTOs for `RateLimitQueryDto`, `FlashSaleDeductDto`, and `SeedFlashSaleDto`.
- `src/modules/redis-lua/interfaces/redis-lua.interface.ts`: Response envelope interfaces for rate limiting and flash sale performance metrics.
- `src/modules/redis-lua/lua/`: Raw Lua script templates (`sliding-window.lua`, `flash-sale-deduct.lua`).
- `src/modules/redis-lua/services/redis-lua-naive.service.ts`: Naive non-atomic multi-step Redis rate limiting and flash sale deduction.
- `src/modules/redis-lua/services/redis-lua-optimized.service.ts`: Optimized atomic Lua script execution via `ioredis`.
- `src/modules/redis-lua/controllers/redis-lua-naive.controller.ts`: Endpoints `GET /api/v1/redis-lua/naive/rate-limit`, `POST /api/v1/redis-lua/naive/flash-sale`.
- `src/modules/redis-lua/controllers/redis-lua-optimized.controller.ts`: Endpoints `GET /.../optimized/rate-limit`, `POST /.../optimized/flash-sale`, and `POST /.../seed`.
- `src/modules/redis-lua/redis-lua.module.ts`: NestJS module declaration.
- `src/modules/redis-lua/postman/redis-lua-postman-collection.json`: Postman collection testing rate limits and flash sale inventory deduction.
- `src/modules/redis-lua/README.md`: Technical documentation detailing Redis Lua atomic execution mechanics.

## 3. Implementation Steps & Sequencing
1. Install `ioredis` and `@types/ioredis` packages if needed.
2. Define DTOs & response envelope contracts in `src/modules/redis-lua/`.
3. Implement Lua scripts for Sliding Window rate limiting and Flash Sale deduction.
4. Implement `RedisLuaNaiveService` & `RedisLuaNaiveController` (non-atomic multi-step Redis calls).
5. Implement `RedisLuaOptimizedService` & `RedisLuaOptimizedController` (atomic Lua scripts).
6. Register `RedisLuaModule` in NestJS `AppModule`.
7. Create Postman Collection artifact and module README.
8. Verify TypeScript build compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
