---
feature: "010-kafka-partitioning-consumer-groups"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — kafka-partitioning-consumer-groups

## 1. Overview & Architecture Approach
Module 3.1 (Kafka Partitioning Keys, Consumer Groups & Offset Management) demonstrates message ordering and fault-tolerant event processing:
1. **Unordered Random Round-Robin Partitioning (`naive`)**: Producing events without partition keys (`key = null`), scattering sequential order lifecycle events across multiple partitions, leading to out-of-order consumption.
2. **Key-Based Partition Routing & Manual Offset Commits (`optimized`)**:
   - **Key-Based Partitioning**: Specifying `key = orderId` to route all lifecycle events (`CREATED`, `PAID`, `SHIPPED`) for a specific order into the exact same partition.
   - **Consumer Groups**: Demonstrating parallel consumer scaling across topic partitions.
   - **Manual Offset Commits (`autoCommit: false`)**: Explicitly committing offsets only after successful event processing, preventing data loss on worker crashes.

## 2. Components & Files Touched
- `src/modules/kafka-core/dto/`: DTOs for `ProduceOrderEventDto` and `CreateTopicDto`.
- `src/modules/kafka-core/interfaces/kafka-core.interface.ts`: Event production and consumer group offset status response envelope contracts.
- `src/modules/kafka-core/services/kafka-core-naive.service.ts`: Naive event production without partition keys (`key = null`).
- `src/modules/kafka-core/services/kafka-core-optimized.service.ts`: Optimized event production with `key = orderId`, consumer group handling, and manual offset commits using `kafkajs`.
- `src/modules/kafka-core/controllers/kafka-core-naive.controller.ts`: Endpoint `POST /api/v1/kafka-core/naive/produce`.
- `src/modules/kafka-core/controllers/kafka-core-optimized.controller.ts`: Endpoints `POST /api/v1/kafka-core/optimized/produce`, `GET /api/v1/kafka-core/optimized/consumer-status`.
- `src/modules/kafka-core/kafka-core.module.ts`: NestJS module declaration.
- `src/modules/kafka-core/postman/kafka-core-postman-collection.json`: Postman collection testing Kafka event production and consumer status.
- `src/modules/kafka-core/README.md`: Technical documentation detailing Kafka partitioning and consumer offset management.

## 3. Implementation Steps & Sequencing
1. Install `kafkajs` package if needed.
2. Define DTOs & response contracts in `src/modules/kafka-core/`.
3. Implement `KafkaCoreNaiveService` & `KafkaCoreNaiveController` (unkeyed random round-robin event production).
4. Implement `KafkaCoreOptimizedService` & `KafkaCoreOptimizedController` (key-based routing, kafkajs producer/consumer, manual commits).
5. Register `KafkaCoreModule` in NestJS `AppModule`.
6. Create Postman Collection artifact and module README.
7. Verify TypeScript build compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
