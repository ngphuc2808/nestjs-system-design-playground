---
feature: "007-concurrency-locking-strategies"
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

# Tasks — concurrency-locking-strategies

## Core Implementation Checklist

- [x] [T1] Create `ProductInventoryEntity` with `stock` and `version` columns in `src/modules/concurrency-locking/entities/`
- [x] [T2] Define DTOs (`DeductStockDto`, `SeedInventoryDto`) and response contracts in `src/modules/concurrency-locking/` (depends: T1)
- [x] [T3] Implement `ConcurrencyLockingNaiveService` and `ConcurrencyLockingNaiveController` for unprotected Read-Modify-Write (depends: T2)
- [x] [T4] Implement `ConcurrencyLockingOptimizedService` and `ConcurrencyLockingOptimizedController` for Optimistic OCC, Pessimistic `FOR UPDATE`, and Advisory Locks (depends: T3)
- [x] [T5] Register `ConcurrencyLockingModule` in NestJS `AppModule`, create Postman Collection artifact, Module README, and verify build compilation (depends: T4)
