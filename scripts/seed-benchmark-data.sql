-- ====================================================================
-- NESTJS SYSTEM DESIGN & HIGH-CONCURRENCY PLAYGROUND
-- HIGH-VOLUME BENCHMARK SEED SCRIPT (PostgreSQL)
-- ====================================================================
-- Instructions: Execute this script in DBeaver (Alt+X) or psql terminal
-- to populate 10,000,000 Users, 10,000,000 Orders, 100,000 Ledger Transactions,
-- 100,000 Outbox Events, and 10,000 Products.
-- ====================================================================

-- 1. SEED 10,000,000 USERS (For Keyset Cursor vs Offset Pagination Benchmark)
TRUNCATE TABLE benchmark_users RESTART IDENTITY;

INSERT INTO benchmark_users (username, email, age, status, created_at)
SELECT 
  'user_' || g,
  'user_' || g || '@example.com',
  (20 + (g % 40)),
  'ACTIVE',
  NOW() - (g || ' seconds')::interval
FROM generate_series(1, 10000000) AS g;

-- 2. SEED 10,000,000 ORDERS (For B-Tree, Partial & JSONB GIN Index Benchmark)
TRUNCATE TABLE benchmark_indexing_orders RESTART IDENTITY;

INSERT INTO benchmark_indexing_orders (user_id, status, total_amount, created_at, metadata)
SELECT 
  (100 + (g % 1000)),
  (ARRAY['PENDING', 'COMPLETED', 'CANCELLED', 'SHIPPED'])[1 + (g % 4)],
  (10 + (g % 500))::numeric(10,2),
  NOW() - (g || ' seconds')::interval,
  jsonb_build_object(
    'category', (ARRAY['ELECTRONICS', 'CLOTHING', 'BOOKS', 'HOME', 'SPORTS'])[1 + (g % 5)],
    'vendorId', 1000 + (g % 50),
    'isPriority', (g % 5 = 0)
  )
FROM generate_series(1, 10000000) AS g;

-- Build GIN Index on JSONB Metadata
CREATE INDEX IF NOT EXISTS idx_orders_meta_gin ON benchmark_indexing_orders USING GIN (metadata);

-- 3. SEED 10,000 PRODUCTS (For Concurrency Control & Advisory Locking)
TRUNCATE TABLE benchmark_products RESTART IDENTITY;

INSERT INTO benchmark_products (id, name, stock, version, updated_at)
SELECT 
  g,
  'Flash Sale Product #' || g,
  1000,
  1,
  NOW()
FROM generate_series(1, 10000) AS g;

-- 4. SEED 100,000 LEDGER ACCOUNTS & TRANSACTIONS (For Immutable SHA-256 Hash Chain)
TRUNCATE TABLE benchmark_ledger_accounts CASCADE;
TRUNCATE TABLE benchmark_ledger_transactions RESTART IDENTITY;

INSERT INTO benchmark_ledger_accounts ("accountId", balance, "updatedAt")
SELECT 
  'ACC_' || (1000 + g),
  (10000 + (g % 50000))::numeric(12,2),
  NOW()
FROM generate_series(1, 10000) AS g;

INSERT INTO benchmark_ledger_transactions ("accountId", amount, type, "previousHash", "currentHash", "createdAt")
SELECT 
  'ACC_' || (1000 + (g % 5000)),
  (10 + (g % 500))::numeric(12,2),
  (ARRAY['CREDIT', 'DEBIT'])[1 + (g % 2)],
  '0000000000000000000000000000000000000000000000000000000000000000',
  md5(g::text || 'hash_chain'),
  NOW() - (g || ' seconds')::interval
FROM generate_series(1, 100000) AS g;

-- 5. SEED 100,000 OUTBOX ORDERS & EVENTS (For Transactional Outbox Pattern)
TRUNCATE TABLE benchmark_outbox_orders CASCADE;
TRUNCATE TABLE benchmark_outbox_events CASCADE;

INSERT INTO benchmark_outbox_orders (id, "orderNumber", "customerId", amount, status, "createdAt")
SELECT 
  gen_random_uuid(),
  'ORD_OUTBOX_' || g,
  'CUST_' || (100 + (g % 1000)),
  (50 + (g % 900))::numeric(10,2),
  'CREATED',
  NOW() - (g || ' seconds')::interval
FROM generate_series(1, 100000) AS g;

INSERT INTO benchmark_outbox_events (id, "aggregateType", "aggregateId", "eventType", payload, status, "createdAt")
SELECT 
  gen_random_uuid(),
  'ORDER',
  'ORD_' || g,
  'ORDER_CREATED',
  jsonb_build_object('orderId', 'ORD_' || g, 'amount', 150.00),
  (ARRAY['PENDING', 'PROCESSED'])[1 + (g % 2)],
  NOW() - (g || ' seconds')::interval
FROM generate_series(1, 100000) AS g;
