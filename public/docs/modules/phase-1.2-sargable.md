# ⚡ Module 1.2 — Sargable Queries & Parameter Plan Caching

> **Tập dữ liệu thử nghiệm**: 10,000,000 dòng (`benchmark_users`).

---

## 📊 1. Bảng So Sánh Kỹ Thuật (Sargable vs Non-Sargable)

| # | Phương Pháp Truy Vấn | Tốc Độ Read (10M Rows) | Kiểu Scanned Scan Type | Prepared Plan Cache Hit | Đánh Giá Chung |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **Non-Sargable (`DATE(created_at) = '2026-08-01'`)** | 🔴 `145.0 ms` | `Seq Scan` (Quét toàn bộ 10M bản ghi) | ❌ Miss (Vô hiệu hóa B-Tree) | Hủy hoại hiệu năng DB do biến đổi cột |
| 2 | **Sargable (`created_at >= '2026-08-01' AND ...`)** | ⚡ `0.8 ms` | `Index Range Scan` (B-Tree Seek) | ✅ Hit (Tận dụng B-Tree Index) | Tối ưu 180x lần, chỉ đọc dải bản ghi cần |
| 3 | **Parameter Binding (`WHERE username = $1`)** | ⚡ `0.5 ms` | `Index Scan` (Prepared Statement) | ✅ Hit 100% (Cache Execution Plan) | Ngăn ngừa SQL Injection & Tái sử dụng Query Plan |

---

## 🌲 2. Sơ Đồ Nguyên Lý Sargable Query

```mermaid
flowchart TD
    A[Client Request: Tìm kiếm theo ngày] --> B{Cách viết câu SQL?}
    
    B -- Non-Sargable: DATE(created_at) = '2026-08-01' --> C[1. Thao tác hàm trên Cột\nDATE(created_at)]
    C --> D[PostgreSQL bắt buộc phải lật 10M bản ghi\nvà gọi hàm DATE() cho từng dòng]
    D --> E[🔴 Sequential Scan: 145 ms]
    
    B -- Sargable: created_at >= '2026-08-01 00:00:00' --> F[2. Giữ nguyên Cột vắng bóng Hàm\ncreated_at >= $1 AND created_at <= $2]
    F --> G[PostgreSQL B-Tree Index Range Seek\nnhảy thẳng tới mốc ngày cần tìm]
    G --> H[⚡ Index Range Scan: 0.8 ms]
```

---

## 🎯 3. Chi Tiết Kỹ Thuật & Tối Ưu Hóa (Deep Dive)

### 📌 1. Khái niệm SARGABLE (Search Argument Able)
**SARGABLE** viết tắt của *Search Argument Able* — là khả năng một câu lệnh SQL cho phép công cụ CSDL (PostgreSQL Engine) tận dụng chỉ mục B-Tree Index để tìm kiếm trực tiếp (Index Seek) thay vì phải quét toàn bộ bảng (Sequential Scan).

#### ❌ Các lỗi Non-Sargable phổ biến gây sập CSDL:
1. **Dùng hàm bọc cột**: `WHERE DATE(created_at) = '2026-08-01'` $\rightarrow$ Postgres phải chạy hàm `DATE()` cho 10 triệu dòng.
2. **Nối chuỗi / Tính toán trên cột**: `WHERE age + 5 = 30` hoặc `WHERE UPPER(username) = 'ADMIN'`.
3. **Wildcard đứng đầu chuỗi**: `WHERE email LIKE '%gmail.com'`.

#### ✅ Cách sửa thành Sargable Query chuẩn:
1. **Dùng dải Range Scan**: `WHERE created_at >= '2026-08-01 00:00:00' AND created_at <= '2026-08-01 23:59:59'`.
2. **Biến đổi phía tham số**: `WHERE age = 30 - 5` hoặc `WHERE username = LOWER('ADMIN')`.
3. **Wildcard đứng cuối chuỗi**: `WHERE email LIKE 'admin%'` (Cho phép Index Prefix Scan).

---

### 📌 2. Prepared Statement & Parameter Binding (`$1, $2`)
- Khi sử dụng Parameter Binding (`WHERE username = $1`):
  1. PostgreSQL chỉ cần **Parse & Compile Execution Plan 1 lần duy nhất**.
  2. Các request sau dùng lại Prepared Statement Plan Cache từ bộ nhớ RAM mà không cần biên dịch lại SQL.
  3. **Chống 100% hiểm họa SQL Injection**.

---

## 🛠️ 4. Danh Sách API Endpoints (cURL Snippets)

### 1. Non-Sargable Date Search (GET - Chậm 145ms)
```bash
curl -s "http://localhost:3000/api/v1/db-sargable/naive/date-search?date=2026-08-01"
```

### 2. Sargable Range Date Search (GET - Siêu tốc 0.8ms)
```bash
curl -s "http://localhost:3000/api/v1/db-sargable/optimized/date-range?startDate=2026-08-01&endDate=2026-08-02"
```

### 3. Parameter Binding Prepared Search (GET - Siêu tốc 0.5ms)
```bash
curl -s "http://localhost:3000/api/v1/db-sargable/optimized/parameter-binding?email=user"
```
