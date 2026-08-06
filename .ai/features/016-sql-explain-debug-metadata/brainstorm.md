---
feature: "016-sql-explain-debug-metadata"
created: "2026-08-06"
---

# Brainstorm — sql-explain-debug-metadata

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-06

### Overview & Purpose
Feature 016 (SQL Query & EXPLAIN ANALYZE Debug Metadata Response Interceptor) enhances all Database benchmark API responses across Phase 1 (`db-pagination`, `db-sargable`, `db-indexing`, `db-window-mview`, `db-ledger`) and Phase 2 (`concurrency-locking`):
1. **Raw SQL Executed Field (`sqlQuery`)**: Every Database API response will include the exact raw SQL query executed (with bound parameters interpolated/formatted).
2. **Ready-to-Run EXPLAIN ANALYZE Command (`explainAnalyzeSql`)**: Includes a copy-pasteable `EXPLAIN ANALYZE <SQL>` string that developers can run directly in DBeaver (`Alt+X`) or `psql` to inspect query execution plans and index usage.
3. **Execution Metadata (`executionTimeMs`, `scanType`)**: Unified debug metadata structure across responses.

### Key Value & Objectives
- **Empirical Query Transparency**: Developers can copy the exact SQL or `EXPLAIN ANALYZE` string from Postman responses and execute it in DBeaver/Database to inspect B-Tree index scans, Seq Scans, and Execution Plans directly.

### Architectural & Module Boundaries
- Code location: `src/common/interceptors/` & Database Services across `src/modules/db-*/`
