# ⚡ Module 1.1: Database Pagination Benchmark

Module này đo đạc và chứng minh thực tế sự khác biệt hiệu năng giữa 3 chiến lược phân trang trong PostgreSQL:

1. **Naive Offset Pagination ($O(N)$)**:
   - Cú pháp: `SELECT * FROM benchmark_users ORDER BY id ASC LIMIT $1 OFFSET $2`
   - Nhược điểm: Với trang sâu (`OFFSET 90000`), PostgreSQL vẫn phải đọc và bỏ qua 90,000 dòng trước khi lấy 20 dòng.

2. **Deferred Join Optimization**:
   - Cú pháp: `SELECT u.* FROM benchmark_users u INNER JOIN (SELECT id FROM benchmark_users ORDER BY id ASC LIMIT $1 OFFSET $2) AS tmp ON u.id = tmp.id`
   - Ưu điểm: Đẩy phần OFFSET xuống Subquery chỉ quét duy nhất cột B-Tree Primary Key (`id`), giảm thiểu I/O đọc full row trên Heap.

3. **Keyset / Cursor-Based Pagination ($O(1)$)**:
   - Cú pháp: `SELECT * FROM benchmark_users WHERE id > $1 ORDER BY id ASC LIMIT $2`
   - Ưu điểm: Đạt thời gian hằng số $O(1)$ nhờ cơ chế Index Seek nhảy trực tiếp tới vị trí `cursor`.

## API Endpoints

- **`POST /api/v1/db-pagination/seed`**: Nạp n bản ghi mẫu vào DB bằng bulk batch insert.
- **`GET /api/v1/db-pagination/naive/users?page=4500&limit=20`**: Test Naive Offset.
- **`GET /api/v1/db-pagination/optimized/users/deferred-join?page=4500&limit=20`**: Test Deferred Join.
- **`GET /api/v1/db-pagination/optimized/users/keyset?cursor=90000&limit=20`**: Test Keyset Cursor.
