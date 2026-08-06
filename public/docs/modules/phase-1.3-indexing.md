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

### 1. Naive Leftmost Prefix Search (GET)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/naive/leftmost?category=ELECTRONICS"
```

### 2. Optimized GIN JSONB Containment Search (GET)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/optimized/gin-jsonb?category=ELECTRONICS"
```

### 3. Optimized Partial Index Search (GET)
```bash
curl -s "http://localhost:3000/api/v1/db-indexing/optimized/partial?status=PENDING"
```
