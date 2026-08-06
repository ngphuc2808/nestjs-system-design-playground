---
feature: "008-redis-lua-rate-limit-flashsale"
---

# Clarify — redis-lua-rate-limit-flashsale

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Which Redis driver and connection setup will be used to execute atomic Lua scripts? | resolved | `ioredis` driver connected to Redis 7 (`localhost:6379`), invoking atomic Lua scripts via `redis.eval(...)`. |
| 2 | How is the Sliding Window Rate Limiter algorithm implemented in Lua? | resolved | Uses a Redis Sorted Set (`ZSET`): `ZREMRANGEBYSCORE` clears expired timestamps, `ZCARD` verifies current window count against limit, and `ZADD` appends current timestamp. |
| 3 | How does the Flash Sale Lua script prevent inventory overselling? | resolved | Atomic script checks `stock >= quantity`, executes `DECRBY` and returns remaining stock if sufficient; otherwise returns `-1` (Sold Out) without partial deductions. |
