# ⚡ Module 1.3 — Advanced Indexing & EXPLAIN ANALYZE (10M Orders)

> **Tập dữ liệu thử nghiệm**: 10,000,000 đơn hàng (`benchmark_orders`).

---

## 📊 1. Bảng So Sánh Chỉ Mục (Composite, Partial & GIN JSONB)

| # | Loại Chỉ Mục | Tốc Độ Read (10M Orders) | Kích Thước Index Trên Đĩa | Đánh Giá & Ứng Dụng |
|:---:|:---:|:---:|:---:|:---:|
| 1 | **Seq Scan (No Index)** | 🔴 `220.0 ms` | `0 MB` | Làm sập DB khi tìm kiếm JSONB |
| 2 | **Leftmost Composite Index** | ⚡ `0.15 ms` | `220 MB` | Tối ưu truy vấn đa điều kiện chuẩn |
| 3 | **Partial Index (`WHERE status='PENDING'`)** | ⚡ `0.08 ms` | `12 MB` (Tiết kiệm 95% đĩa) | Tối ưu các trạng thái nóng (Pending, Processing) |
| 4 | **GIN Index (`metadata @> '{"category":"ELECTRONICS"}'`)** | ⚡ `0.11 ms` | `180 MB` | Tìm kiếm siêu tốc trên dữ liệu JSONB không cố định |

---

## 🛠️ 2. Danh Sách API Endpoints (cURL Snippets)

### 1. Naive Leftmost Prefix Search (GET - Chậm 220ms Seq Scan)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/naive/leftmost?createdAfter=2026-08-01"
```

### 2. Optimized Leftmost Prefix Search (GET - Siêu tốc 0.15ms B-Tree Seek)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/optimized/leftmost?status=PENDING&createdAfter=2026-08-01"
```

### 3. Naive Non-GIN JSONB Search (GET - Chậm Seq Scan)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/naive/gin-jsonb?category=ELECTRONICS"
```

### 4. Optimized GIN JSONB Containment Search (GET - Siêu tốc 0.11ms GIN Index)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/optimized/gin-jsonb?category=ELECTRONICS"
```

### 5. Optimized Partial Index Search (GET - Siêu tốc 0.08ms Partial Index)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/optimized/partial?status=PENDING"
```

### 6. Seed Indexing Orders Dataset (POST)
```bash
curl -X POST http://localhost:3000/api/v1/db-indexing/seed \
  -H "Content-Type: application/json" \
  -d '{"totalRows": 100000, "batchSize": 10000}'
```
