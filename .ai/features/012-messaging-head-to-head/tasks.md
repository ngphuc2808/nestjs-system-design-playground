---
feature: "012-messaging-head-to-head"
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

# Tasks — messaging-head-to-head

## Core Implementation Checklist

- [x] [T1] Check/install `amqplib` and `bullmq` dependencies and define DTOs (`BenchmarkRunDto`) and response contracts in `src/modules/messaging-comparison/`
- [x] [T2] Implement `MessagingComparisonNaiveService` and `MessagingComparisonNaiveController` for basic serial message publish (depends: T1)
- [x] [T3] Implement `MessagingComparisonOptimizedService` and `MessagingComparisonOptimizedController` for head-to-head benchmark across Kafka, RabbitMQ, BullMQ, and comparison matrix (depends: T2)
- [x] [T4] Register `MessagingComparisonModule` in NestJS `AppModule` and verify build compilation (depends: T3)
- [x] [T5] Create Postman Collection artifact, Module README documentation, and verify benchmark endpoints (depends: T4)
