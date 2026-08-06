# 🚀 NestJS System Design & High-Concurrency Playground: Learning Roadmap

Tài liệu này quy định lộ trình phát triển chi tiết của hệ thống **NestJS Playground / Modular Monolith**, sắp xếp theo thứ tự ưu tiên và mức độ phụ thuộc. Mỗi tính năng hỗ trợ khởi tạo nhanh qua **Slash Command (`/add-feature`)** hoặc **Terminal CLI (`ai-framework add-feature`)**.

---

## 📊 Bảng Tổng Quan Lộ Trình (Roadmap Matrix)

| Phase | Mã Module | Tên Module / Tính Năng | Lệnh Slash Command (Gõ trong Chat) | Lệnh Terminal CLI | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | `infra` | Infrastructure Setup (Docker, DB, Cache, Brokers) | `/add-feature infra-docker-setup` | `ai-framework add-feature infra-docker-setup` | ✅ Done |
| **Phase 0** | `module-0` | Learning Progress & Roadmap Management | `/add-feature learning-progress-management` | `ai-framework add-feature learning-progress-management --touches src/modules/learning-progress/` | ✅ Done |
| **Phase 1** | `module-1.1` | Pagination Benchmark (Offset vs Deferred Join vs Keyset) | `/add-feature db-pagination-benchmark` | `ai-framework add-feature db-pagination-benchmark --touches src/modules/db-pagination/` | ✅ Done |
| **Phase 1** | `module-1.2` | Sargable Queries & Parameter Plan Caching | `/add-feature db-sargable-parameter-binding` | `ai-framework add-feature db-sargable-parameter-binding --touches src/modules/db-sargable/` | ✅ Done |
| **Phase 1** | `module-1.3` | Advanced Indexing & EXPLAIN ANALYZE | `/add-feature db-advanced-indexing-explain` | `ai-framework add-feature db-advanced-indexing-explain --touches src/modules/db-indexing/` | ✅ Done |
| **Phase 1** | `module-1.4` | Window Functions & Materialized Views | `/add-feature db-window-functions-materialized-views` | `ai-framework add-feature db-window-functions-materialized-views --touches src/modules/db-window-mview/` | ✅ Done |
| **Phase 1** | `module-1.5` | Immutable Ledger Pattern (SHA-256 Chaining) | `/add-feature db-ledger-pattern` | `ai-framework add-feature db-ledger-pattern --touches src/modules/db-ledger/` | ✅ Done |
| **Phase 2** | `module-2.1` | Concurrency Control & Advisory Locks | `/add-feature concurrency-locking-strategies` | `ai-framework add-feature concurrency-locking-strategies --touches src/modules/concurrency-locking/` | ✅ Done |
| **Phase 2** | `module-2.2` | High-Throughput Rate Limiting & Flash Sale (Redis Lua) | `/add-feature redis-lua-rate-limit-flashsale` | `ai-framework add-feature redis-lua-rate-limit-flashsale --touches src/modules/redis-lua/` | ✅ Done |
| **Phase 2** | `module-2.3` | Idempotency Key & PgBouncer Pool Optimization | `/add-feature idempotency-connection-pooling` | `ai-framework add-feature idempotency-connection-pooling --touches src/modules/idempotency-pool/` | ✅ Done |
| **Phase 3** | `module-3.1` | Kafka Partitioning, Consumer Groups & Offsets | `/add-feature kafka-partitioning-consumer-groups` | `ai-framework add-feature kafka-partitioning-consumer-groups --touches src/modules/kafka-core/` | ✅ Done |
| **Phase 3** | `module-3.2` | Transactional Outbox Pattern | `/add-feature transactional-outbox-pattern` | `ai-framework add-feature transactional-outbox-pattern --touches src/modules/outbox-pattern/` | ✅ Done |
| **Phase 3** | `module-3.3` | Messaging Head-to-Head (Kafka vs RabbitMQ vs BullMQ) | `/add-feature messaging-head-to-head` | `ai-framework add-feature messaging-head-to-head --touches src/modules/messaging-comparison/` | ✅ Done |
| **Phase 4** | `module-4.1` | Dynamic Feature Flags & Shadow Traffic | `/add-feature traffic-engineering-feature-flags` | `ai-framework add-feature traffic-engineering-feature-flags --touches src/modules/traffic-engineering/` | ✅ Done |
| **Phase 4** | `module-4.2` | High-Performance CSV/Excel File Streaming | `/add-feature file-stream-processing` | `ai-framework add-feature file-stream-processing --touches src/modules/file-streaming/` | ✅ Done |

---

## 🛠️ Chi Tiết Triển Khai Theo Thứ Tự Phase

### 📍 PHASE 0: Infrastructure & Learning Engine

#### Step 0.1 — Base Infrastructure Setup (`infra-docker-setup`)
- **Mục tiêu**: Xây dựng toàn bộ các container dịch vụ ở local với `docker-compose.yml`.
- **Dịch vụ**: PostgreSQL 16, Redis 7, Apache Kafka (KRaft), RabbitMQ management.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature infra-docker-setup`
  - 💻 **Terminal CLI**: `ai-framework add-feature infra-docker-setup`

#### Step 0.2 — Module 0: Learning Progress & Dashboard (`learning-progress-management`)
- **Mục tiêu**: Xây dựng module quản lý tiến độ thực hành và lưu chỉ số Latency (ms) / RPS giữa 2 bản `naive` và `optimized`.
- **APIs**: `GET /api/v1/learning-progress/summary`, `PATCH /api/v1/learning-progress/:topicId`
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature learning-progress-management`
  - 💻 **Terminal CLI**: `ai-framework add-feature learning-progress-management --touches src/modules/learning-progress/`

---

### 📍 PHASE 1: Deep Database Optimization & Execution Engine (PostgreSQL)

#### Step 1.1 — Pagination Benchmark (`db-pagination-benchmark`)
- **Mục tiêu**: So sánh trực tiếp 3 cơ chế phân trang trên bảng lớn (> 1,000,000 dòng):
  - `Offset Pagination`: `OFFSET 1000000 LIMIT 20` ($O(N)$ - Seq scan/Index scan bỏ qua N bản ghi).
  - `Deferred Join`: Tối ưu Offset bằng cách Join chỉ lấy PK trước (`SELECT id FROM ... OFFSET ... LIMIT ...`).
  - `Keyset / Cursor-based Pagination`: `WHERE id > last_seen_id LIMIT 20` ($O(1)$ - Index seek).
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature db-pagination-benchmark`
  - 💻 **Terminal CLI**: `ai-framework add-feature db-pagination-benchmark --touches src/modules/db-pagination/`

#### Step 1.2 — Sargable Queries & Parameter Binding (`db-sargable-parameter-binding`)
- **Mục tiêu**: Minh họa lỗi bọc hàm trong điều kiện SQL làm mất Index và cơ chế Prepared Statements.
- **Nội dung**:
  - Non-Sargable: `WHERE DATE(created_at) = '2026-08-05'` vs Sargable: `WHERE created_at >= '2026-08-05 00:00:00' AND created_at < '2026-08-06 00:00:00'`.
  - Prepared Statements: So sánh String Concatenation vs `$1`, `$2` parameter binding giảm CPU parse/plan execution.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature db-sargable-parameter-binding`
  - 💻 **Terminal CLI**: `ai-framework add-feature db-sargable-parameter-binding --touches src/modules/db-sargable/`

#### Step 1.3 — Advanced Indexing Strategies & EXPLAIN ANALYZE (`db-advanced-indexing-explain`)
- **Mục tiêu**: Đọc hiểu Execution Plan (`EXPLAIN ANALYZE`) và sử dụng các loại Index chuyên sâu.
- **Nội dung**:
  - So sánh Scan Types: `Seq Scan`, `Index Scan`, `Index Only Scan`, `Bitmap Index Scan`.
  - Thực hành Indexing: `B-Tree`, `GIN/GiST` (JSONB search), `Covering Index` (`INCLUDE`), `Partial Index` (`WHERE status = 'PENDING'`), `Composite Index` (Leftmost Prefix Rule), `BRIN Index` (Time-series data).
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature db-advanced-indexing-explain`
  - 💻 **Terminal CLI**: `ai-framework add-feature db-advanced-indexing-explain --touches src/modules/db-indexing/`

#### Step 1.4 — Window Functions & Materialized Views (`db-window-functions-materialized-views`)
- **Mục tiêu**: Đẩy các tác vụ tính toán báo cáo nặng xuống DB, giải phóng RAM Node.js Event Loop.
- **Nội dung**:
  - Window Functions: `ROW_NUMBER()`, `RANK()`, `LAG()`, `LEAD()`, `SUM() OVER()`.
  - Materialized View: Tạo MView cho câu query báo cáo tổng hợp + cơ chế `REFRESH MATERIALIZED VIEW CONCURRENTLY`.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature db-window-functions-materialized-views`
  - 💻 **Terminal CLI**: `ai-framework add-feature db-window-functions-materialized-views --touches src/modules/db-window-mview/`

#### Step 1.5 — Immutable Financial Ledger Pattern (`db-ledger-pattern`)
- **Mục tiêu**: Xây dựng sổ cái tài chính Append-Only không cho phép UPDATE/DELETE, kiểm tra tính toàn vẹn bằng Hash Chain.
- **Nội dung**:
  - Chuỗi Hash SHA-256 nối tiếp giữa các dòng giao dịch `hash(previous_hash + current_data)`.
  - Triggers/Rules ngăn chặn thao tác sửa xóa dữ liệu lịch sử.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature db-ledger-pattern`
  - 💻 **Terminal CLI**: `ai-framework add-feature db-ledger-pattern --touches src/modules/db-ledger/`

---

### 📍 PHASE 2: High Concurrency (CCU), Locking & Rate Limiting

#### Step 2.1 — Concurrency Control & Advisory Locks (`concurrency-locking-strategies`)
- **Mục tiêu**: Giải quyết bài toán nổ đơn hàng, Race Conditions khi nhiều CCU sửa cùng 1 bản ghi.
- **Nội dung**:
  - `Optimistic Locking`: Dùng cột `version` để phát hiện xung đột khi UPDATE.
  - `Pessimistic Locking`: `SELECT ... FOR UPDATE` khóa dòng trực tiếp trong DB Transaction.
  - `Postgres Advisory Locks`: `pg_advisory_xact_lock(key)` tạo Distributed Lock nhẹ ở tầng DB mà không cần Redis.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature concurrency-locking-strategies`
  - 💻 **Terminal CLI**: `ai-framework add-feature concurrency-locking-strategies --touches src/modules/concurrency-locking/`

#### Step 2.2 — Redis Lua Rate Limiting & Flash Sale Inventory (`redis-lua-rate-limit-flashsale`)
- **Mục tiêu**: Xử lý tải cao nguyên tố (Atomic) trực tiếp trên In-Memory Store.
- **Nội dung**:
  - Rate Limiter: So sánh `Sliding Window Log` vs `Token Bucket` vs `Leaky Bucket` dùng Redis Lua Script.
  - Flash Sale Inventory: Script Lua giảm tồn kho nguyên tố trên Redis, chống Overselling dưới tải 10,000+ RPS.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature redis-lua-rate-limit-flashsale`
  - 💻 **Terminal CLI**: `ai-framework add-feature redis-lua-rate-limit-flashsale --touches src/modules/redis-lua/`

#### Step 2.3 — Idempotency Key Pattern & PgBouncer Connection Pooling (`idempotency-connection-pooling`)
- **Mục tiêu**: Bảo đảm tính an toàn khi Retry và tối ưu tài nguyên kết nối DB.
- **Nội dung**:
  - Idempotency Token Filter lưu trên Redis ngăn chặn trùng đơn hàng khi client bấm nút nhiều lần.
  - Cấu hình PgBouncer / TypeORM Connection Pool (`max`, `idleTimeout`) tránh cạn kiệt Connection socket.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature idempotency-connection-pooling`
  - 💻 **Terminal CLI**: `ai-framework add-feature idempotency-connection-pooling --touches src/modules/idempotency-pool/`

---

### 📍 PHASE 3: Apache Kafka Deep Dive & High-Throughput Messaging

#### Step 3.1 — Kafka Partitioning, Consumer Groups & Offsets (`kafka-partitioning-consumer-groups`)
- **Mục tiêu**: Làm chủ thứ tự tin nhắn và cơ chế Scale-out của Apache Kafka.
- **Nội dung**:
  - Partition Key Hashing: Đảm bảo message của cùng 1 User/Order luôn rơi vào 1 Partition (Strict Ordering).
  - Consumer Groups & Rebalance: Mô phỏng chia tải giữa các node consumer và xử lý khi 1 node sập.
  - Commit Strategies: So sánh `Auto-commit` vs `Manual Commit` (`At Least Once` vs `At Most Once`).
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature kafka-partitioning-consumer-groups`
  - 💻 **Terminal CLI**: `ai-framework add-feature kafka-partitioning-consumer-groups --touches src/modules/kafka-core/`

#### Step 3.2 — Transactional Outbox Pattern (`transactional-outbox-pattern`)
- **Mục tiêu**: Đảm bảo tính nhất quán dữ liệu 100% giữa PostgreSQL DB và Kafka (Dual-Write Problem).
- **Nội dung**:
  - Ghi Business Data + Event vào bảng `outbox` trong cùng 1 Local Transaction DB.
  - Polling Worker / Change Data Capture (CDC) đọc bảng `outbox` đẩy sang Kafka và mark completed.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature transactional-outbox-pattern`
  - 💻 **Terminal CLI**: `ai-framework add-feature transactional-outbox-pattern --touches src/modules/outbox-pattern/`

#### Step 3.3 — Messaging Head-to-Head: Kafka vs RabbitMQ vs BullMQ (`messaging-head-to-head`)
- **Mục tiêu**: So sánh hiệu năng và kịch bản áp dụng của 3 công nghệ Message Broker phổ biến.
- **Nội dung**:
  - Thiết kế bài toán **Order Notification** qua 1 Strategy Interface duy nhất.
  - So sánh trực tiếp: **Kafka** (Distributed Streaming) vs **RabbitMQ** (AMQP Exchange/Routing/DLQ) vs **BullMQ** (Redis Priority/Delayed Queue).
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature messaging-head-to-head`
  - 💻 **Terminal CLI**: `ai-framework add-feature messaging-head-to-head --touches src/modules/messaging-comparison/`

---

### 📍 PHASE 4: Traffic Engineering & File Streaming

#### Step 4.1 — Dynamic Feature Flagging & Shadow Traffic (`traffic-engineering-feature-flags`)
- **Mục tiêu**: Điều hướng Traffic linh hoạt và thử nghiệm tính năng mới an toàn trên Production/Local.
- **Nội dung**:
  - Feature Flag Rollout: Phân luồng X% Traffic theo `hash(user_id) % 100` (Consistent Hashing).
  - Shadow Traffic (Traffic Mirroring): Sao chép Async Request gửi sang Background Worker để test tải/logic mới không ảnh hưởng latency chính.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature traffic-engineering-feature-flags`
  - 💻 **Terminal CLI**: `ai-framework add-feature traffic-engineering-feature-flags --touches src/modules/traffic-engineering/`

#### Step 4.2 — High-Performance Stream File Processing (`file-stream-processing`)
- **Mục tiêu**: Xử lý File CSV/Excel khổng lồ (100,000+ dòng) nạp trực tiếp vào DB mà không gây cạn kiệt RAM.
- **Nội dung**:
  - Naive: Đọc toàn bộ file vào Memory (`fs.readFileSync`) gây Out-Of-Memory (OOM).
  - Optimized: Dùng Node.js Native Streams (`pipeline`, `Transform`) vừa đọc chunk vừa Batch Insert vào DB.
- **Lệnh thực thi**:
  - 💬 **Slash Command**: `/add-feature file-stream-processing`
  - 💻 **Terminal CLI**: `ai-framework add-feature file-stream-processing --touches src/modules/file-streaming/`

---

## 📌 Quy Chuẩn Thư Mục Mỗi Feature Sau Khi Thực Thi Lệnh

Mỗi tính năng khi tạo với `ai-framework add-feature` sẽ scaffold thư mục `.ai/features/<NNN>-<slug>/` để làm việc. Khi triển khai Code, cấu trúc sẽ được ánh xạ tương ứng vào `src/modules/<feature-name>/`:

```text
src/modules/<feature-name>/
├── controllers/
│   ├── <feature>-naive.controller.ts
│   └── <feature>-optimized.controller.ts
├── services/
│   ├── <feature>-naive.service.ts
│   └── <feature>-optimized.service.ts
├── interfaces/
├── dto/
├── entities/
├── postman/
│   └── <feature>-postman-collection.json
└── README.md
```
