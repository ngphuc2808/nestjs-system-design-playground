---
feature: "008-redis-lua-rate-limit-flashsale"
created: "2026-08-05"
---

# Brainstorm — redis-lua-rate-limit-flashsale

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 2.2 (High-Throughput Rate Limiting & Flash Sale Stock Deduction with Atomic Redis Lua Scripts) demonstrates ultra-low-latency in-memory rate limiting and flash sale oversell prevention:
1. **Unprotected Multi-Step Redis Commands (`naive`)**:
   - Executing `redis.get()` followed by `redis.set()` or separate `INCR` and `EXPIRE` calls over network round-trips.
   - Network race conditions under 1,000+ RPS lead to inaccurate rate limits and overselling during flash sales.
2. **Atomic Sliding Window Rate Limiter via Redis Lua Script (`optimized`)**:
   - Single atomic Redis Lua script managing a Sorted Set (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`) to implement a sub-millisecond Sliding Window Log rate limiter.
3. **Atomic Flash Sale Inventory Deduction via Redis Lua Script (`optimized`)**:
   - Atomic Lua script executing `redis.call('DECRBY', key, amount)` with immediate bounds checking (`stock < 0` rollback).
   - Offloads 100,000+ RPS flash sale order placement directly into Redis memory, preventing PostgreSQL DB pool exhaustion during flash sales.

### Key Value & Objectives
- **Sub-Millisecond Latency & High Concurrency**: Benchmark latency and throughput between multiple network calls vs single atomic Redis Lua script executions.
- **Dual Controllers**:
  - `RedisLuaNaiveController`: `/api/v1/redis-lua/naive/rate-limit`, `/naive/flash-sale` (Non-atomic separate Redis calls).
  - `RedisLuaOptimizedController`: `/api/v1/redis-lua/optimized/rate-limit`, `/optimized/flash-sale` (Atomic Lua Scripts) and `POST /api/v1/redis-lua/seed`.

### Architectural & Module Boundaries
- Code location: `src/modules/redis-lua/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- Infrastructure: Redis 7 (`localhost:6379`) via `ioredis` driver
