# ⚡ NestJS System Design & High-Concurrency Architecture Portal

> **Local-first NestJS Modular Monolith Playground** engineered for deep hands-on learning, empirical benchmarking, and side-by-side comparison (`naive` vs `optimized`) of advanced system architecture.

---

## 🚀 Tổng Quan 4 Giai Đoạn Nâng Cấp Kỹ Thuật (Phases 1-4)

### 📌 Phase 1 — Database Optimization & Indexes (10 Million Rows)
- **Module 1.1 — Pagination & Write Benchmark Suite**: So sánh 6 phương pháp phân trang (Naive Offset, Keyset Cursor, Deferred Join, Covering Index INCLUDE, Pre-computed Page Map $\mathcal{O}(1)$, Elasticsearch Search-After) và Write Benchmark Suite.
- **Module 1.2 — Sargable Queries**: Tận dụng B-Tree Index Range Scan và Prepared Statement Plan Caching.
- **Module 1.3 — Advanced Indexing & EXPLAIN**: Phân tích B-Tree Composite, Partial Index, và GIN JSONB Containment trên 10,000,000 dòng.
- **Module 1.4 — Window Functions & Concurrent MViews**: Đưa tính toán phân hạng về SQL Engine và Refresh Materialized View Concurrently.
- **Module 1.5 — Cryptographic SHA-256 Ledger**: Xây dựng sổ cái tài chính bất biến bằng chuỗi băm Cryptographic SHA-256 Hash Chaining.

### 📌 Phase 2 — High Concurrency & Lock Management
- **Module 2.1 — Concurrency Control**: Chống race condition tồn kho bằng Optimistic OCC Versioning và Postgres Advisory Locks (`pg_advisory_xact_lock`).
- **Module 2.2 — Redis Lua Flash Sale**: Đạt 25,000 RPS nguyên tử (Atomic Single-Threaded Lua Script) chống bán lố (Zero Overselling).
- **Module 2.3 — Idempotency Key**: Lọc trùng request quẹt thẻ bằng Redis SET NX EX và PgBouncer Connection Pooling.

### 📌 Phase 3 — Event-Driven Architecture & Messaging
- **Module 3.1 — Kafka Partition Routing**: Điều hướng message theo Partition Key (MurmurHash2) đảm bảo thứ tự thời gian 100%.
- **Module 3.2 — Transactional Outbox Pattern**: Bảo vệ chống mất dữ liệu Dual-Write giữa DB và Kafka bằng CDC Relay Worker.
- **Module 3.3 — Messaging Head-to-Head**: So sánh hiệu năng trực tiếp giữa Apache Kafka, RabbitMQ AMQP, và BullMQ.

### 📌 Phase 4 — Traffic Engineering & Large Data Streaming
- **Module 4.1 — Dynamic Feature Flags & Shadow Traffic**: Điều phối % Canary Rollout sub-5ms bằng Redis và Mirror Traffic thử nghiệm ngầm (`setImmediate`).
- **Module 4.2 — High-Performance File Streaming**: Xử lý file CSV hàng triệu dòng với bộ nhớ RAM cố định `< 30 MB` bằng Node.js Stream Pipeline Backpressure.

---

## 🛠️ Script Khởi Tạo Index Database
Toàn bộ câu lệnh SQL DDL khởi tạo Index và bảng phụ trợ được lưu trữ tại file:
📁 **`scripts/setup_benchmark_indexes.sql`**
