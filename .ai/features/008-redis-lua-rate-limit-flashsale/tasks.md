---
feature: "008-redis-lua-rate-limit-flashsale"
status: approved
generated_from_plan_version: 1
tasks:
  - id: T1
    depends_on: []
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T2
    depends_on: [T1]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T3
    depends_on: [T2]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T4
    depends_on: [T3]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T5
    depends_on: [T4]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
---

# Tasks — redis-lua-rate-limit-flashsale

## Core Implementation Checklist

- [x] [T1] Check/install `ioredis` driver and define DTOs (`RateLimitQueryDto`, `FlashSaleDeductDto`) and response contracts in `src/modules/redis-lua/`
- [x] [T2] Implement Lua scripts for Sliding Window Log rate limiting and Flash Sale inventory deduction in `src/modules/redis-lua/lua/` (depends: T1)
- [x] [T3] Implement `RedisLuaNaiveService` and `RedisLuaNaiveController` executing non-atomic multi-step Redis commands (depends: T2)
- [x] [T4] Implement `RedisLuaOptimizedService` and `RedisLuaOptimizedController` executing atomic Lua scripts via `ioredis` (depends: T3)
- [x] [T5] Register `RedisLuaModule` in NestJS `AppModule`, create Postman Collection artifact, Module README, and verify build compilation (depends: T4)
