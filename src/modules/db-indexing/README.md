# ⚡ Module 1.3: Advanced Indexing Strategies & EXPLAIN ANALYZE

Module này đo đạc và phân tích trực tiếp Execution Plan (`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`) trong PostgreSQL:

1. **Leftmost Prefix Rule (Composite Index)**:
   - Index: `idx_orders_status_created ON (status, created_at)`
   - Naive: `WHERE created_at >= $1` (Vi phạm Leftmost Prefix Rule -> **`Seq Scan`**).
   - Optimized: `WHERE status = $1 AND created_at >= $2` (Thỏa mãn Leftmost Prefix Rule -> **`Index Scan`**).

2. **GIN Index for JSONB Search**:
   - Index: `idx_orders_meta_gin ON USING GIN (metadata)`
   - Naive: `WHERE metadata::text LIKE '%ELECTRONICS%'` (Ép ép kiểu text -> **`Seq Scan`**).
   - Optimized: `WHERE metadata @> '{"category": "ELECTRONICS"}'` (Toán tử `@>` kích hoạt **`Bitmap Index Scan`** qua GIN index).

3. **Partial Index**:
   - Index: `idx_orders_pending_status ON (id) WHERE status = 'PENDING'`
   - Optimized: `WHERE status = 'PENDING'` chỉ đọc Index siêu nhỏ dành riêng cho các đơn hàng chưa xử lý.

## API Endpoints

- **`POST /api/v1/db-indexing/seed`**: Nạp 50,000 ~ 100,000 đơn hàng mẫu có JSONB metadata.
- **`GET /api/v1/db-indexing/naive/leftmost`**: Test vi phạm Leftmost Prefix Rule.
- **`GET /api/v1/db-indexing/optimized/leftmost`**: Test thỏa mãn Leftmost Prefix Rule.
- **`GET /api/v1/db-indexing/naive/gin-jsonb`**: Test ép kiểu JSONB sang text.
- **`GET /api/v1/db-indexing/optimized/gin-jsonb`**: Test toán tử GIN JSONB Containment `@>`.
- **`GET /api/v1/db-indexing/optimized/partial`**: Test Partial Index scan.
