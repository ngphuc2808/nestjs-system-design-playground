---
feature: "011-transactional-outbox-pattern"
created: "2026-08-05"
---

# Brainstorm — transactional-outbox-pattern

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 3.2 (Transactional Outbox Pattern & CDC Poller/Relay) solves the Dual-Write Problem across Databases and Message Brokers:
1. **Dual-Write Problem (`naive`)**:
   - `POST /api/v1/outbox-pattern/naive/create-order`: Saving order state in DB (`INSERT INTO orders`) and directly publishing a message to Kafka/RabbitMQ (`broker.send()`) in two separate I/O steps.
   - If the database commit succeeds but the network to Kafka drops (or vice versa), the system enters an inconsistent state where orders exist in DB without event notifications, or events are published for rolled-back DB orders.
2. **Transactional Outbox Pattern (`optimized`)**:
   - Both the order entity and an outbox event record (`benchmark_outbox_events`) are saved within the **same atomic database transaction**.
   - An asynchronous Relay/Poller queries pending outbox records (`status = 'PENDING'`), publishes them to Kafka/RabbitMQ, and marks them `PROCESSED`.
   - Guarantees **At-Least-Once Delivery** and 100% data consistency between DB state and Message Broker events.

### Key Value & Objectives
- **Atomic Dual-Write Guarantee**: Zero message loss and zero orphan DB commits during broker outages.
- **Dual Controllers**:
  - `OutboxPatternNaiveController`: `/api/v1/outbox-pattern/naive/create-order` (Unsafe Dual-Write).
  - `OutboxPatternOptimizedController`: `/api/v1/outbox-pattern/optimized/create-order`, `/outbox-events`, and `/relay/trigger` (Atomic Outbox table insert & relay processing).

### Architectural & Module Boundaries
- Code location: `src/modules/outbox-pattern/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `entities/`, `postman/`, `README.md`
- Infrastructure: PostgreSQL 16 via TypeORM, Kafka/RabbitMQ messaging
