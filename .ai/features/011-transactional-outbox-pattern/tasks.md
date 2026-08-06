---
feature: "011-transactional-outbox-pattern"
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

# Tasks — transactional-outbox-pattern

## Core Implementation Checklist

- [x] [T1] Create `OutboxOrderEntity` and `OutboxEventEntity` in `src/modules/outbox-pattern/entities/`
- [x] [T2] Define DTOs (`CreateOutboxOrderDto`) and response contracts in `src/modules/outbox-pattern/` (depends: T1)
- [x] [T3] Implement `OutboxPatternNaiveService` and `OutboxPatternNaiveController` for unsafe Dual-Write order creation (depends: T2)
- [x] [T4] Implement `OutboxPatternOptimizedService` and `OutboxPatternOptimizedController` for atomic DB outbox transaction and CDC Relay poller (depends: T3)
- [x] [T5] Register `OutboxPatternModule` in NestJS `AppModule`, create Postman Collection artifact, Module README, and verify build compilation (depends: T4)
