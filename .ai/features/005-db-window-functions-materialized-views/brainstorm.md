---
feature: "005-db-window-functions-materialized-views"
created: "2026-08-05"
---

# Brainstorm — db-window-functions-materialized-views

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 1.4 (Window Functions & Materialized Views) demonstrates offloading heavy analytical aggregations to PostgreSQL:
1. **Window Functions**: Utilizing `ROW_NUMBER()`, `RANK()`, `LAG()`, `LEAD()`, and `SUM() OVER(PARTITION BY ... ORDER BY ...)` directly inside the database engine to perform ranking, running totals, and delta calculations without loading millions of rows into Node.js application memory.
   - **Naive (`Application-level aggregation`)**: Fetching all raw order rows into Node.js memory arrays (`fs`/Array methods) and calculating running sums/rankings in JS, causing Node.js Event Loop blocking and high heap memory footprint.
   - **Optimized (`SQL Window Functions`)**: Executing database-level window aggregations returning only the processed analytics page.
2. **Materialized Views & Concurrent Refreshing**:
   - Creating Materialized Views (`CREATE MATERIALIZED VIEW mv_daily_sales_summary`) for heavy multi-table reporting.
   - Triggering concurrent non-blocking view refreshes (`REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales_summary`) using unique index constraints without locking read traffic.

### Key Value & Objectives
- **Memory & Latency Reduction**: Measure heap memory consumption and execution time between Node.js array manipulation vs PostgreSQL Window Functions / Materialized Views.
- **Dual Controllers**:
  - `DbWindowMviewNaiveController`: `/api/v1/db-window-mview/naive/analytics`
  - `DbWindowMviewOptimizedController`: `/api/v1/db-window-mview/optimized/analytics/window`, `/mview`, and `/mview/refresh`

### Architectural & Module Boundaries
- Code location: `src/modules/db-window-mview/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- DB Engine: PostgreSQL 16 via TypeORM / Raw SQL driver
