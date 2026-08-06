---
feature: "010-kafka-partitioning-consumer-groups"
created: "2026-08-05"
---

# Brainstorm — kafka-partitioning-consumer-groups

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 3.1 (Kafka Partitioning Keys, Consumer Groups & Offset Management) demonstrates message ordering and fault-tolerant event processing:
1. **Unordered Random Round-Robin Partitioning (`naive`)**:
   - Producing events without partition keys (`key = null`), scattering sequential user order events across multiple Kafka partitions.
   - Out-of-order event consumption causes state corruption (e.g. `ORDER_CANCELLED` processed before `ORDER_CREATED`).
2. **Key-Based Partitioning & Manual Offset Commits (`optimized`)**:
   - **Key-Based Partition Routing**: Hashing `key = orderId` guarantees that all events for a specific order land in the exact same Kafka partition, preserving strict per-entity sequential ordering.
   - **Consumer Groups & Parallel Scaling**: Multiple consumer instances assigned to distinct partitions.
   - **Manual Offset Commits (`enableAutoCommit: false`)**: Explicitly committing offsets only after successful message processing, preventing message loss during worker crashes.

### Key Value & Objectives
- **Strict Per-Entity Ordering Guarantee**: Producing order events (`CREATED`, `PAID`, `SHIPPED`) with `key = orderId` land in the same partition.
- **Dual Controllers**:
  - `KafkaCoreNaiveController`: `/api/v1/kafka-core/naive/produce` (Random round-robin, no message key).
  - `KafkaCoreOptimizedController`: `/api/v1/kafka-core/optimized/produce` (Key-based partition routing), `/api/v1/kafka-core/optimized/consumer-status`.

### Architectural & Module Boundaries
- Code location: `src/modules/kafka-core/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- Infrastructure: Apache Kafka (`localhost:9092`) via `kafkajs` driver
