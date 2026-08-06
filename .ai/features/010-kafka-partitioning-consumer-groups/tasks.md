---
feature: "010-kafka-partitioning-consumer-groups"
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

# Tasks — kafka-partitioning-consumer-groups

## Core Implementation Checklist

- [x] [T1] Check/install `kafkajs` driver and define DTOs (`ProduceOrderEventDto`) and response contracts in `src/modules/kafka-core/`
- [x] [T2] Implement `KafkaCoreNaiveService` and `KafkaCoreNaiveController` for unkeyed random round-robin event production (depends: T1)
- [x] [T3] Implement `KafkaCoreOptimizedService` and `KafkaCoreOptimizedController` for key-based partition routing, consumer groups, and manual commits (depends: T2)
- [x] [T4] Register `KafkaCoreModule` in NestJS `AppModule` and verify build compilation (depends: T3)
- [x] [T5] Create Postman Collection artifact, Module README documentation, and verify Kafka endpoints (depends: T4)
