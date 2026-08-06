---
feature: "009-idempotency-connection-pooling"
---

# Clarify — idempotency-connection-pooling

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | How will the Idempotency Key header be extracted and validated? | resolved | Reads HTTP header `x-idempotency-key`. In Optimized endpoint, returns HTTP 400 Bad Request if missing. |
| 2 | How are concurrent in-flight duplicate requests handled under high concurrency? | resolved | Acquires Redis atomic lock `idempotency:lock:<key>` using `SET NX EX 30`. Concurrent duplicates receive HTTP 409 Conflict ("Request currently in progress"). |
| 3 | How are completed response payloads cached and returned for retry requests? | resolved | Stores completed HTTP response payload in Redis key `idempotency:result:<key>` with 24h TTL, returning cached response directly with header `x-cache: HIT`. |
