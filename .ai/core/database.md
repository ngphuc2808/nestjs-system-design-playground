---
provenance: manual
status: sql
variant: sql
last_verified: "2026-08-05"
---

# Database Specifications & Strategy

## Database Engine
- **Primary RDBMS**: PostgreSQL 16+
- **Connection Pooling**: PgBouncer + TypeORM Pool Config (`max`, `idleTimeout`)

## Key PostgreSQL Features Exercised
- **Indexing**: B-Tree, GIN, GiST, Partial Indexes (`WHERE status = 'PENDING'`), Covering Indexes (`INCLUDE`), Composite Indexes, BRIN Index for Time-Series.
- **Query Optimization**: Sargable queries, Parameter Binding (Prepared Statements), Execution Plan analysis (`EXPLAIN ANALYZE`).
- **Pagination**: Offset vs Keyset (Cursor) vs Deferred Join benchmarking.
- **Advanced SQL**: Window functions (`ROW_NUMBER`, `RANK`, `LAG`, `LEAD`), Materialized Views with `REFRESH MATERIALIZED VIEW CONCURRENTLY`.
- **Locking & Concurrency**: Optimistic (`version`), Pessimistic (`SELECT ... FOR UPDATE`), Postgres Advisory Locks (`pg_advisory_xact_lock`).
- **Ledger Pattern**: Append-only immutable tables with SHA-256 hash chaining.
