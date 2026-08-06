---
feature: "011-transactional-outbox-pattern"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — transactional-outbox-pattern

## 1. Overview & Architecture Approach
Module 3.2 (Transactional Outbox Pattern & CDC Poller/Relay) solves the Dual-Write Problem across Databases and Message Brokers:
1. **Unsafe Dual-Write (`naive`)**: Saving an order in DB and attempting direct broker publishing in separate steps. Network failures cause orphan DB records without event notifications.
2. **Transactional Outbox Pattern (`optimized`)**: Saving both order entity (`benchmark_outbox_orders`) and Outbox event record (`benchmark_outbox_events`) inside a single atomic PostgreSQL DB transaction. An asynchronous Relay poller uses `FOR UPDATE SKIP LOCKED` to publish pending outbox events to Kafka/Broker and update `status = 'PROCESSED'`, guaranteeing **At-Least-Once Delivery**.

## 2. Components & Files Touched
- `src/modules/outbox-pattern/entities/outbox-order.entity.ts`: Order entity.
- `src/modules/outbox-pattern/entities/outbox-event.entity.ts`: Outbox table entity with `status` (`PENDING`, `PROCESSED`, `FAILED`).
- `src/modules/outbox-pattern/dto/`: DTO for `CreateOutboxOrderDto`.
- `src/modules/outbox-pattern/interfaces/outbox-pattern.interface.ts`: Response envelopes for order creation and relay status metrics.
- `src/modules/outbox-pattern/services/outbox-pattern-naive.service.ts`: Naive unsafe Dual-Write order creation.
- `src/modules/outbox-pattern/services/outbox-pattern-optimized.service.ts`: Atomic outbox transaction creation and CDC Relay poller execution.
- `src/modules/outbox-pattern/controllers/outbox-pattern-naive.controller.ts`: Endpoint `POST /api/v1/outbox-pattern/naive/create-order`.
- `src/modules/outbox-pattern/controllers/outbox-pattern-optimized.controller.ts`: Endpoints `POST /api/v1/outbox-pattern/optimized/create-order`, `GET /api/v1/outbox-pattern/optimized/outbox-events`, `POST /api/v1/outbox-pattern/optimized/relay/trigger`.
- `src/modules/outbox-pattern/outbox-pattern.module.ts`: NestJS module declaration.
- `src/modules/outbox-pattern/postman/outbox-pattern-postman-collection.json`: Postman collection testing atomic outbox creation and relay poller.
- `src/modules/outbox-pattern/README.md`: Technical documentation detailing the Transactional Outbox Pattern mechanics.

## 3. Implementation Steps & Sequencing
1. Define `OutboxOrderEntity` and `OutboxEventEntity` with TypeORM.
2. Define DTOs & response contracts in `src/modules/outbox-pattern/`.
3. Implement `OutboxPatternNaiveService` & `OutboxPatternNaiveController` (unsafe Dual-Write).
4. Implement `OutboxPatternOptimizedService` & `OutboxPatternOptimizedController` (atomic outbox transaction & CDC relay poller with `FOR UPDATE SKIP LOCKED`).
5. Register `OutboxPatternModule` in NestJS `AppModule`.
6. Create Postman Collection artifact and module README.
7. Verify TypeScript build compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
