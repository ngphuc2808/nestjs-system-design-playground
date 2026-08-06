---
feature: "016-sql-explain-debug-metadata"
version: 1
based_on_clarify: "2026-08-06"
review_decision: proceed_to_task
---

# Plan — sql-explain-debug-metadata

## 1. Overview & Architecture Approach
Feature 016 equips all Database benchmark endpoints across Phase 1 & Phase 2 with a standardized `sqlDebug` response metadata block containing:
- `rawSql`: The exact raw SQL statement executed with bound parameter placeholders.
- `explainAnalyzeSql`: A copy-pasteable SQL string prefixed with `EXPLAIN ANALYZE <sql query>` ready to be run in DBeaver (`Alt+X`) or `psql`.
- `scanType`: High-level scan classification (Index Seek / Seq Scan / GIN Index Containment).

## 2. Components & Files Touched
- `src/common/interfaces/sql-debug.interface.ts`: Data structure for `SqlDebugMetadata`.
- `src/modules/db-pagination/services/`: Update `DbPaginationNaiveService` & `DbPaginationOptimizedService` to attach `sqlDebug`.
- `src/modules/db-sargable/services/`: Update `DbSargableNaiveService` & `DbSargableOptimizedService` to attach `sqlDebug`.
- `src/modules/db-indexing/services/`: Update `DbIndexingNaiveService` & `DbIndexingOptimizedService` to attach `sqlDebug`.
- `src/modules/db-window-mview/services/`: Update `DbWindowMviewNaiveService` & `DbWindowMviewOptimizedService` to attach `sqlDebug`.
- `src/modules/db-ledger/services/`: Update `DbLedgerNaiveService` & `DbLedgerOptimizedService` to attach `sqlDebug`.

## 3. Implementation Steps & Sequencing
1. Define `SqlDebugMetadata` interface in `src/common/interfaces/sql-debug.interface.ts`.
2. Enhance Phase 1.1 `db-pagination` services to return `sqlDebug`.
3. Enhance Phase 1.2 `db-sargable` services to return `sqlDebug`.
4. Enhance Phase 1.3 `db-indexing` services to return `sqlDebug`.
5. Enhance Phase 1.4 `db-window-mview` services to return `sqlDebug`.
6. Enhance Phase 1.5 `db-ledger` services to return `sqlDebug`.
7. Verify build compilation (`pnpm run build`) and test Postman responses.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-06)
