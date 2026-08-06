---
feature: "007-concurrency-locking-strategies"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — concurrency-locking-strategies

## 1. Overview & Architecture Approach
Module 2.1 (Concurrency Control & Locking Strategies) demonstrates high-concurrency race condition handling:
1. **Unprotected Read-Modify-Write (`naive`)**: Separate `SELECT` and `UPDATE` statements without locking, leading to Lost Updates and negative stock overbooking.
2. **Optimistic Concurrency Control (OCC) (`optimized`)**: Using a `version` column (`WHERE id = $1 AND version = $2`), failing fast when concurrent writes conflict.
3. **Pessimistic Locking (`FOR UPDATE`) (`optimized`)**: Acquiring an exclusive row-level DB lock to serialize concurrent stock deductions.
4. **PostgreSQL Advisory Locks (`pg_advisory_xact_lock`) (`optimized`)**: Application-defined lock key in PostgreSQL transaction context for granular critical section locking.

## 2. Components & Files Touched
- `src/modules/concurrency-locking/entities/product-inventory.entity.ts`: Entity for `benchmark_products` with `stock` and `version` columns.
- `src/modules/concurrency-locking/dto/`: DTOs for `DeductStockDto` and `SeedInventoryDto`.
- `src/modules/concurrency-locking/interfaces/concurrency-locking.interface.ts`: Response envelope interfaces for stock deduction benchmark metrics.
- `src/modules/concurrency-locking/services/concurrency-locking-naive.service.ts`: Naive unprotected stock deduction.
- `src/modules/concurrency-locking/services/concurrency-locking-optimized.service.ts`: Optimized OCC (Version column), Pessimistic `FOR UPDATE`, and PostgreSQL Advisory Locks (`pg_advisory_xact_lock`).
- `src/modules/concurrency-locking/controllers/concurrency-locking-naive.controller.ts`: Endpoint `POST /api/v1/concurrency-locking/naive/deduct`.
- `src/modules/concurrency-locking/controllers/concurrency-locking-optimized.controller.ts`: Endpoints `POST /.../optimized/deduct/optimistic`, `/pessimistic`, `/advisory`, and `POST /.../seed`.
- `src/modules/concurrency-locking/concurrency-locking.module.ts`: NestJS module wiring TypeORM feature and raw query runners.
- `src/modules/concurrency-locking/postman/concurrency-locking-postman-collection.json`: Postman collection testing stock deduction strategies.
- `src/modules/concurrency-locking/README.md`: Technical documentation detailing locking strategies and race condition mechanics.

## 3. Implementation Steps & Sequencing
1. Define `ProductInventoryEntity` with TypeORM.
2. Define DTOs & response envelope contracts in `src/modules/concurrency-locking/`.
3. Implement `ConcurrencyLockingNaiveService` & `ConcurrencyLockingNaiveController` (unprotected Read-Modify-Write).
4. Implement `ConcurrencyLockingOptimizedService` & `ConcurrencyLockingOptimizedController` (OCC, Pessimistic `FOR UPDATE`, and Advisory Locks).
5. Register `ConcurrencyLockingModule` in NestJS `AppModule`.
6. Create Postman Collection artifact and module README.
7. Verify TypeScript build compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
