# ⚡ NestJS System Design & High-Concurrency Playground

> A production-grade NestJS playground demonstrating real-world high-concurrency techniques, database optimizations, event-driven messaging, traffic engineering, and streaming performance comparisons.

[![NestJS](https://img.shields.io/badge/NestJS-v11.0.1-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16.0-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-v7.0-red.svg)](https://redis.io/)
[![Apache Kafka](https://img.shields.io/badge/Kafka-KRaft-black.svg)](https://kafka.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Architecture & Design Principles

Every module in this repository follows a strict **Naïve vs. Optimized** comparison pattern:
- **`naive/`**: Monolithic, un-indexed, blocking, or high-memory consumption baseline code path.
- **`optimized/`**: High-performance, index-seeking, atomic, non-blocking, or stream-backed optimized code path.

---

## 🗺️ Complete Learning Roadmap (12/12 Modules Completed)

| Phase | Module Code | Technical Topic | Naïve Approach | Optimized Approach | Status |
|---|---|---|---|---|---|
| **Phase 0** | `infra-setup` | Infrastructure Setup | Baseline Docker setup | PostgreSQL 16 + Redis 7 + Kafka KRaft + RabbitMQ | ✅ Done |
| **Phase 0** | `module-0` | Learning Progress API | Hardcoded tracking | SOLID-compliant progress & benchmark summary API | ✅ Done |
| **Phase 1** | `module-1.1` | Pagination Benchmark (10M Rows) | Offset `O(N)` Seq Scan (1,418 ms) | Keyset Cursor `O(log N)` Index Seek (**3.1 ms** - 450x faster) | ✅ Done |
| **Phase 1** | `module-1.2` | Sargable Queries & Plan Caching | Non-sargable `DATE()` wrapper | Sargable Index Range Scan + Prepared Statements | ✅ Done |
| **Phase 1** | `module-1.3` | Advanced Indexing & EXPLAIN (10M Rows) | Full table Seq Scan | B-Tree Leftmost Prefix, Partial Index, GIN JSONB (**0.1 ms**) | ✅ Done |
| **Phase 1** | `module-1.4` | Window Functions & MViews | In-memory V8 row aggregation | SQL `ROW_NUMBER()` & Concurrent Materialized Views | ✅ Done |
| **Phase 1** | `module-1.5` | Immutable Ledger Pattern | Mutable `UPDATE balance` | Append-only Cryptographic SHA-256 Hash Chaining | ✅ Done |
| **Phase 2** | `module-2.1` | Concurrency Control & Locking | Unlocked race conditions | Optimistic OCC Versioning vs `FOR UPDATE` vs Advisory Locks | ✅ Done |
| **Phase 2** | `module-2.2` | Redis Lua Rate Limit & Flash Sale | Non-atomic check-then-set | Atomic Single-Threaded Redis Lua Scripts (25,000 RPS) | ✅ Done |
| **Phase 2** | `module-2.3` | Idempotency Key & DB Pool | Double-charging risk | Header `x-idempotency-key` Redis SET NX + Pool Metrics | ✅ Done |
| **Phase 3** | `module-3.1` | Kafka Partitions & Consumer Groups | Round-robin unordered delivery | Key-based partition routing (`orderId`) + Manual Commit | ✅ Done |
| **Phase 3** | `module-3.2` | Transactional Outbox Pattern | Unsafe dual-write | Atomic DB Outbox + CDC Relay (`FOR UPDATE SKIP LOCKED`) | ✅ Done |
| **Phase 3** | `module-3.3` | Messaging Head-to-Head | Single queue bottleneck | Comparative Benchmark Matrix: Kafka vs RabbitMQ vs BullMQ | ✅ Done |
| **Phase 4** | `module-4.1` | Dynamic Feature Flags & Canary | Hardcoded `if/else` redeploys | Redis Dynamic Flags (sub-5ms) + Async Shadow Traffic | ✅ Done |
| **Phase 4** | `module-4.2` | High-Performance File Streaming | `readFileSync` RAM bloat | Node.js Stream Backpressure (< 30 MB RAM) & Chunked Export | ✅ Done |

---

## ⚡ Live Performance Benchmark Highlights (Empirical Results)

### 1. Pagination on 10,000,000 Rows (`benchmark_users`)
- **Naïve Offset (`OFFSET 5,000,000`)**: `1,418.04 ms` (~5,000,000 rows scanned & discarded).
- **Optimized Keyset Cursor (`WHERE id > 5000000`)**: **`3.14 ms`** (Exactly 20 rows read via index seek).
- **Result**: **450x Speedup** via Index Seeking.

### 2. JSONB Search on 10,000,000 Orders (`benchmark_indexing_orders`)
- **GIN Index Containment (`metadata @> '{"category": "ELECTRONICS"}'`)**: **`0.114 ms`** sub-millisecond search latency across 10M JSONB records.

### 3. Flash Sale High-Concurrency Inventory (`redis-lua`)
- **Atomic Redis Lua DECRBY**: **25,000 RPS** with **0% overselling / race conditions**.

### 4. Large CSV File Processing (`file-streaming`)
- **Node.js Pipeline Stream Backpressure**: Ingests/exports 100,000+ row CSV files maintaining a constant RAM footprint **< 30 MB**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v20+ / v22+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) & Docker Compose

### 2. Infrastructure Setup
Start PostgreSQL, Redis, Kafka, and RabbitMQ via Docker Compose:
```bash
docker-compose up -d
```

### 3. Install Dependencies & Build
```bash
pnpm install
pnpm run build
```

### 4. Seed High-Volume Benchmark Dataset (10 Million Rows)
Run the automated seed script to populate PostgreSQL with 10M Users, 10M Orders, 10k Products, 100k Ledger Transactions, and 100k Outbox Events:
```bash
pnpm run seed:benchmark
```
*Alternatively, you can execute the SQL script [`scripts/seed-benchmark-data.sql`](scripts/seed-benchmark-data.sql) directly in DBeaver (`Alt+X`).*

### 5. Start NestJS Server
```bash
pnpm run start:dev
```
*Server running on `http://localhost:3000`.*

---

## 🧪 Testing with Postman

Each module comes with its own pre-built Postman Collection artifact:
- `src/modules/db-pagination/postman/db-pagination-postman-collection.json`
- `src/modules/db-sargable/postman/db-sargable-postman-collection.json`
- `src/modules/db-indexing/postman/db-indexing-postman-collection.json`
- `src/modules/db-window-mview/postman/db-window-mview-postman-collection.json`
- `src/modules/db-ledger/postman/db-ledger-postman-collection.json`
- `src/modules/concurrency-locking/postman/concurrency-locking-postman-collection.json`
- `src/modules/redis-lua/postman/redis-lua-postman-collection.json`
- `src/modules/idempotency-pool/postman/idempotency-pool-postman-collection.json`
- `src/modules/kafka-core/postman/kafka-core-postman-collection.json`
- `src/modules/outbox-pattern/postman/outbox-pattern-postman-collection.json`
- `src/modules/messaging-comparison/postman/messaging-comparison-postman-collection.json`
- `src/modules/traffic-engineering/postman/traffic-engineering-postman-collection.json`
- `src/modules/file-streaming/postman/file-streaming-postman-collection.json`

---

## 👤 Author & License

Developed by **[ngphuc2808](https://github.com/ngphuc2808)** under the **MIT License**.
