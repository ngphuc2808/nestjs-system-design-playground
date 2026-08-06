---
feature: "012-messaging-head-to-head"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — messaging-head-to-head

## 1. Overview & Architecture Approach
Module 3.3 (Messaging Head-to-Head Comparison Benchmark) evaluates architectural trade-offs, throughput, and latency across Kafka, RabbitMQ, and BullMQ:
1. **Generic Single-Queue Producer (`naive`)**: Basic serial message publish without comparative metrics or system design recommendations.
2. **Head-to-Head Comparative Benchmark (`optimized`)**:
   - **Kafka**: Log-centric distributed streaming, optimized for massive throughput (100k+ msg/sec) and event replayability.
   - **RabbitMQ**: Advanced AMQP message broker, supporting flexible routing (Direct, Fanout, Topic, Headers) and per-message ACKs.
   - **BullMQ**: Redis-backed job queue, featuring delayed jobs, retries, and rate limiting.
   - Executing benchmark tests comparing throughput (msg/sec), p95/p99 latency (ms), and returning architectural trade-off recommendations.

## 2. Components & Files Touched
- `src/modules/messaging-comparison/dto/`: DTOs for `BenchmarkRunDto` and `PublishMessageDto`.
- `src/modules/messaging-comparison/interfaces/messaging-comparison.interface.ts`: Benchmark results, engine metrics, and comparison matrix contracts.
- `src/modules/messaging-comparison/services/messaging-comparison-naive.service.ts`: Basic single-queue message publisher.
- `src/modules/messaging-comparison/services/messaging-comparison-optimized.service.ts`: Comprehensive head-to-head benchmark orchestrator across Kafka, RabbitMQ, and BullMQ.
- `src/modules/messaging-comparison/controllers/messaging-comparison-naive.controller.ts`: Endpoint `POST /api/v1/messaging-comparison/naive/publish`.
- `src/modules/messaging-comparison/controllers/messaging-comparison-optimized.controller.ts`: Endpoints `POST /api/v1/messaging-comparison/optimized/benchmark`, `GET /api/v1/messaging-comparison/optimized/comparison-matrix`.
- `src/modules/messaging-comparison/messaging-comparison.module.ts`: NestJS module declaration.
- `src/modules/messaging-comparison/postman/messaging-comparison-postman-collection.json`: Postman collection artifact for messaging benchmarks.
- `src/modules/messaging-comparison/README.md`: Technical documentation detailing messaging architecture trade-offs.

## 3. Implementation Steps & Sequencing
1. Define DTOs & response contracts in `src/modules/messaging-comparison/`.
2. Implement `MessagingComparisonNaiveService` & `MessagingComparisonNaiveController` (basic serial message publish).
3. Implement `MessagingComparisonOptimizedService` & `MessagingComparisonOptimizedController` (benchmark orchestrator, latency percentiles, and comparison matrix).
4. Register `MessagingComparisonModule` in NestJS `AppModule`.
5. Create Postman Collection artifact and module README.
6. Verify TypeScript build compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
