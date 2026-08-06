-- ==============================================================================
-- ⚡ PostgreSQL Index Creation & Page Map Generation Script
-- (For Databases That Already Have Benchmark Data Loaded)
-- Run these DDL statements in DBeaver / pgAdmin / psql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Build Pre-computed Page Map Table (For O(1) Instant Random Page Jump < 2ms)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS benchmark_page_map (
    page_number INT PRIMARY KEY,
    min_id INT NOT NULL
);

-- Populate page map mốc id cho mỗi 20 bản ghi/trang từ dữ liệu hiện có
TRUNCATE benchmark_page_map;

INSERT INTO benchmark_page_map (page_number, min_id)
SELECT ceil(row_num / 20.0)::int AS page_number, min(id) AS min_id
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) AS row_num
    FROM benchmark_users
) AS tmp
GROUP BY ceil(row_num / 20.0);

-- ------------------------------------------------------------------------------
-- 2. Advanced Indexing on benchmark_indexing_orders (Phase 1.3)
-- ------------------------------------------------------------------------------
-- 2.1 Composite Index satisfying Leftmost Prefix Rule (status, created_at)
CREATE INDEX IF NOT EXISTS idx_orders_status_created 
ON benchmark_indexing_orders (status, created_at);

-- 2.2 Partial Index devoted to PENDING status orders
CREATE INDEX IF NOT EXISTS idx_orders_pending_status 
ON benchmark_indexing_orders (id) 
WHERE status = 'PENDING';

-- 2.3 GIN Index for JSONB containment operator (@>)
CREATE INDEX IF NOT EXISTS idx_orders_meta_gin 
ON benchmark_indexing_orders USING GIN (metadata);

-- ------------------------------------------------------------------------------
-- 3. Verification Query: Inspect All Built Indexes
-- ------------------------------------------------------------------------------
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('benchmark_users', 'benchmark_indexing_orders');
