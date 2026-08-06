---
feature: "009-idempotency-connection-pooling"
created: "2026-08-05"
---

# Brainstorm — idempotency-connection-pooling

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 2.3 (Idempotency Key Pattern & PgBouncer Connection Pool Optimization) demonstrates safe API retry mechanisms and database connection pool tuning under high traffic:
1. **Non-Idempotent Duplicate Execution (`naive`)**:
   - `POST /api/v1/idempotency-pool/naive/payment` executes payment charges without validating header `Idempotency-Key`.
   - Network retries from mobile clients or payment gateways result in **Double Charging** and duplicate transaction records.
2. **Idempotency Key Pattern with Redis Atomic Lock & Result Caching (`optimized`)**:
   - `Idempotency-Key` header validation:
     - State 1 `PROCESSING`: Redis lock `idempotency:lock:<key>` set via `SET key token NX EX 30` to prevent concurrent duplicate request handling.
     - State 2 `COMPLETED`: Stores exact response payload in Redis (`idempotency:result:<key>`) with a 24-hour TTL. Duplicate requests with the same key instantly receive the cached response without re-executing database mutations or payment processing.
3. **Database Connection Pool Exhaustion vs PgBouncer Optimization**:
   - Demonstrating how unmanaged connection spikes cause PostgreSQL `sorry, too many clients already` errors vs managing pool limits and connection checkout times.

### Key Value & Objectives
- **Zero Double-Charging Guarantee**: Retrying identical POST payment requests returns the exact cached HTTP response without secondary charge execution.
- **Dual Controllers**:
  - `IdempotencyPoolNaiveController`: `/api/v1/idempotency-pool/naive/payment` (Non-idempotent duplicate charges).
  - `IdempotencyPoolOptimizedController`: `/api/v1/idempotency-pool/optimized/payment` (Idempotent header check) and `GET /api/v1/idempotency-pool/optimized/pool-status`.

### Architectural & Module Boundaries
- Code location: `src/modules/idempotency-pool/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- Infrastructure: Redis 7 (`ioredis`) for Idempotency locks & response caching, PostgreSQL 16 via TypeORM / Raw SQL driver
