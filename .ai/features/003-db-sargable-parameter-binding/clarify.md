---
feature: "003-db-sargable-parameter-binding"
---

# Clarify — db-sargable-parameter-binding

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Which database table should be used for testing Sargable vs Non-Sargable queries? | resolved | Reuse the `benchmark_users` PostgreSQL table from Module 1.1 with B-Tree indexed columns (`id`, `created_at`). |
| 2 | How will Non-Sargable function wrapping (`DATE(created_at)`) be contrasted against Sargable range queries? | resolved | Naive endpoint runs `WHERE DATE(created_at) = '2026-08-05'` (Seq Scan), while Optimized endpoint runs `WHERE created_at >= '2026-08-05 00:00:00' AND created_at < '2026-08-06 00:00:00'` (Index Scan). |
| 3 | How will Parameter Binding Prepared Statements be benchmarked against raw string concatenation? | resolved | Naive endpoint executes raw string concatenation (`WHERE username = '${name}'`), while Optimized endpoint executes `$1`, `$2` prepared statement parameters to demonstrate Plan Cache efficiency. |
