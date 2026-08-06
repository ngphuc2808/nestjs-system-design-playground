---
provenance: reverse-search
scanned_at: "2026-08-06"
confidence: high
---

# Architecture — NestJS System Design & High-Concurrency Playground

## Overview
Modular Monolith NestJS architecture demonstrating real-world high-concurrency techniques, database optimizations, event-driven messaging, traffic engineering, and streaming performance comparisons.

## Core Modules
- **Learning Progress (`src/modules/learning-progress/`)**: Roadmap tracking and 100% completion metrics.
- **Phase 1: Database Performance (`src/modules/db-*/`)**:
  - `db-pagination`: Offset vs Deferred Join vs Keyset Cursor-based O(1) pagination on 10M rows.
  - `db-sargable`: Index Range Scan vs Seq Scan & Prepared Statement Plan Caching.
  - `db-indexing`: B-Tree Leftmost Prefix, Partial Indexing, and JSONB GIN Indexing on 10M rows.
  - `db-window-mview`: SQL Window Functions (ROW_NUMBER/RANK) & Concurrent Materialized View refreshing.
  - `db-ledger`: Append-only immutable financial ledger with cryptographic SHA-256 hash chaining.
- **Phase 2: High-Concurrency & Locking (`src/modules/concurrency-locking/`, `src/modules/redis-lua/`, `src/modules/idempotency-pool/`)**:
  - `concurrency-locking`: Optimistic OCC versioning vs Pessimistic FOR UPDATE vs Postgres Advisory Locks.
  - `redis-lua`: Atomic Redis Lua scripts for Sliding Window Log rate limiting & Flash Sale inventory reduction.
  - `idempotency-pool`: Header x-idempotency-key Redis token filter & PgBouncer connection pool metrics.
- **Phase 3: Event-Driven & Messaging (`src/modules/kafka-core/`, `src/modules/outbox-pattern/`, `src/modules/messaging-comparison/`)**:
  - `kafka-core`: Key-based partition routing & consumer group offset management.
  - `outbox-pattern`: Transactional Outbox pattern with DB polling CDC relay (FOR UPDATE SKIP LOCKED).
  - `messaging-comparison`: Head-to-head benchmark matrix across Kafka vs RabbitMQ vs BullMQ.
- **Phase 4: Traffic Engineering & File Streaming (`src/modules/traffic-engineering/`, `src/modules/file-streaming/`)**:
  - `traffic-engineering`: Dynamic Redis feature flags sub-5ms, percentage canary rollouts, and background shadow traffic dark launching.
  - `file-streaming`: Node.js stream pipeline CSV parser with backpressure keeping RAM footprint < 30 MB & chunked HTTP CSV export stream.
