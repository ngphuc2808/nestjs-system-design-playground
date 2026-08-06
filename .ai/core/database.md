---
provenance: reverse-search
scanned_at: "2026-08-06"
confidence: high
---

# Database Schema & Data Models — NestJS Playground

## Target Database
PostgreSQL 16 running on port `5432` (`nestjs_playground`).

## Entities & Tables

1. **`benchmark_users`** (`UserBenchmarkEntity`):
   - `id` (PK, Serial)
   - `username` (VARCHAR)
   - `email` (VARCHAR)
   - `age` (INT)
   - `status` (VARCHAR, DEFAULT 'ACTIVE')
   - `created_at` (TIMESTAMPTZ)
   - *Indexes*: B-Tree Index on `id`, B-Tree Index on `created_at`.
   - *Volume*: 10,000,000 rows.

2. **`benchmark_indexing_orders`** (`IndexingOrderEntity`):
   - `id` (PK, Serial)
   - `user_id` (INT)
   - `status` (VARCHAR)
   - `total_amount` (DECIMAL(10,2))
   - `created_at` (TIMESTAMPTZ)
   - `metadata` (JSONB)
   - *Indexes*: Composite B-Tree `idx_orders_status_created` (status, created_at), Partial Index `idx_orders_pending_status` (status = 'PENDING'), GIN Index `idx_orders_meta_gin` (metadata).
   - *Volume*: 10,000,000 rows.

3. **`benchmark_products`** (`ProductInventoryEntity`):
   - `id` (PK, Serial)
   - `name` (VARCHAR)
   - `stock` (INT, DEFAULT 100)
   - `version` (INT, VersionColumn)
   - `updated_at` (TIMESTAMPTZ)
   - *Volume*: 10,000 rows.

4. **`benchmark_ledger_accounts`** (`AccountBalanceEntity`):
   - `accountId` (PK, VARCHAR)
   - `balance` (DECIMAL(12,2))
   - `updatedAt` (TIMESTAMPTZ)

5. **`benchmark_ledger_transactions`** (`LedgerTransactionEntity`):
   - `id` (PK, Serial)
   - `accountId` (VARCHAR, Index)
   - `amount` (DECIMAL(12,2))
   - `type` ('CREDIT' | 'DEBIT')
   - `previousHash` (VARCHAR)
   - `currentHash` (VARCHAR)
   - `createdAt` (TIMESTAMPTZ)

6. **`benchmark_outbox_orders`** (`OutboxOrderEntity`):
   - `id` (PK, UUID)
   - `orderNumber` (VARCHAR)
   - `customerId` (VARCHAR)
   - `amount` (DECIMAL(10,2))
   - `status` (VARCHAR)
   - `createdAt` (TIMESTAMPTZ)

7. **`benchmark_outbox_events`** (`OutboxEventEntity`):
   - `id` (PK, UUID)
   - `aggregateType` (VARCHAR)
   - `aggregateId` (VARCHAR)
   - `eventType` (VARCHAR)
   - `payload` (JSONB)
   - `status` ('PENDING' | 'PROCESSED' | 'FAILED')
   - `createdAt` (TIMESTAMPTZ)
   - `processedAt` (TIMESTAMPTZ, Nullable)
