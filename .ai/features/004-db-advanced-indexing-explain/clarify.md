---
feature: "004-db-advanced-indexing-explain"
---

# Clarify — db-advanced-indexing-explain

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | What database schema & indexing strategy should be created for this module? | resolved | Create `benchmark_indexing_orders` table with columns `id`, `user_id`, `status`, `total_amount`, `created_at`, and `metadata` (JSONB), with Covering (`INCLUDE`), Partial (`WHERE status = 'PENDING'`), Composite (`status, created_at`), and GIN (`metadata`) indexes. |
| 2 | How will PostgreSQL `EXPLAIN ANALYZE` metrics be returned via API endpoints? | resolved | Endpoints execute `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` and return the execution plan tree alongside parsed metrics (`scanType`, `executionTimeMs`, `sharedHitBlocks`, `sharedReadBlocks`). |
| 3 | How will the Leftmost Prefix Rule of Composite Indexes be demonstrated? | resolved | Naive query searches trailing column `created_at` alone (`Seq Scan`), whereas Optimized query searches leading column `status` first (`Index Scan`). |
