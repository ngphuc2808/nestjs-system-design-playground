---
feature: "005-db-window-functions-materialized-views"
---

# Clarify — db-window-functions-materialized-views

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Which analytical metrics will be implemented using SQL Window Functions? | resolved | User order ranking (`ROW_NUMBER() OVER`), running cumulative revenue (`SUM() OVER`), and order-to-order amount difference (`LAG()`). |
| 2 | How will Node.js memory consumption be measured between Naive JS processing and SQL Window Functions? | resolved | Response envelopes expose `heapUsedMb` (measured via `process.memoryUsage()`) and `executionTimeMs`, demonstrating how SQL Window Functions prevent Node.js Event Loop blocking. |
| 3 | How will Materialized Views & Concurrent Refreshing be set up and triggered? | resolved | Create `mv_user_order_analytics` with unique index `idx_mv_user_analytics_id` enabling non-blocking `REFRESH MATERIALIZED VIEW CONCURRENTLY` via `POST /api/v1/db-window-mview/optimized/mview/refresh`. |
