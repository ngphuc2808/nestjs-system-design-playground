---
feature: "002-db-pagination-benchmark"
---

# Clarify — db-pagination-benchmark

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | How should the 1,000,000 mock user rows be seeded into PostgreSQL for testing? | resolved | Provide a dedicated seeding endpoint `POST /api/v1/db-pagination/seed` using PostgreSQL batch insert chunks (10,000 rows/batch) to populate the table in seconds. |
| 2 | How should benchmark metrics (execution time, scan type, explain plan) be exposed to the caller? | resolved | Standardized response envelope containing `data`, `meta` (page, limit, total, cursor), and `performance` (`executionTimeMs`, `scanType`, `totalRowsScanned`). |
| 3 | Should TypeORM QueryBuilder or raw SQL queries be used for the benchmark implementations? | resolved | Use raw SQL queries via TypeORM QueryRunner/`pg` driver to guarantee exact control over `OFFSET`, `DEFERRED JOIN`, `WHERE id > $1`, and prepared statement binding. |
