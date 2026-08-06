---
feature: "016-sql-explain-debug-metadata"
---

# Clarify — sql-explain-debug-metadata

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Where will the SQL query and EXPLAIN ANALYZE command be attached in Postman responses? | resolved | Attached inside the `meta.sqlDebug` or `performance.sqlDebug` response object of Database endpoints. |
| 2 | What exact fields will be provided in the debug metadata? | resolved | `rawSql` (executed SQL string), `explainAnalyzeSql` (copy-pasteable EXPLAIN ANALYZE query string for DBeaver), and `scanType`. |
| 3 | Which modules will expose this debug metadata? | resolved | All Database modules across Phase 1 & Phase 2 (`db-pagination`, `db-sargable`, `db-indexing`, `db-window-mview`, `db-ledger`, `concurrency-locking`). |
