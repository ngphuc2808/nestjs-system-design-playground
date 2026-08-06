# ⚡ Module 2.1 — Concurrency Control & Advisory Locks

> **Mục tiêu**: Xử lý xung đột tranh chấp dữ liệu (Race Conditions) dưới tải cao.

---

## 🛠️ Danh Sách API Endpoints (cURL Snippets)

### 1. Naive Unlocked Stock Deduction (POST)
```bash
curl -X POST http://localhost:3000/api/v1/concurrency-locking/naive/deduct \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":1}'
```

### 2. Optimized Optimistic OCC Versioning (POST)
```bash
curl -X POST http://localhost:3000/api/v1/concurrency-locking/optimized/deduct/optimistic \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":1}'
```

### 3. Optimized Postgres Advisory Lock (POST)
```bash
curl -X POST http://localhost:3000/api/v1/concurrency-locking/optimized/deduct/advisory \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":1}'
```
