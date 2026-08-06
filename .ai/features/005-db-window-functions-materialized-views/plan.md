---
feature: "005-db-window-functions-materialized-views"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — db-window-functions-materialized-views

## 1. Overview & Architecture Approach
Module 1.4 demonstrates offloading heavy analytical processing to PostgreSQL using Window Functions and Materialized Views:
1. **Window Functions**: Performing `ROW_NUMBER() OVER(...)`, `SUM() OVER(...)`, and `LAG(...) OVER(...)` directly in PostgreSQL, eliminating Node.js heap memory exhaustion and Event Loop blocking.
2. **Materialized Views**: Aggregating sales metrics into a pre-computed Materialized View (`mv_user_order_analytics`), with non-blocking concurrent refreshes (`REFRESH MATERIALIZED VIEW CONCURRENTLY`).

## 2. Components & Files Touched
- `src/modules/db-window-mview/dto/`: DTO for analytics queries and refresh actions.
- `src/modules/db-window-mview/interfaces/db-window-mview.interface.ts`: Analytics response envelopes exposing `heapUsedMb` and `executionTimeMs`.
- `src/modules/db-window-mview/services/db-window-mview-naive.service.ts`: Naive in-memory JS array aggregation (fetching raw rows into Node.js memory).
- `src/modules/db-window-mview/services/db-window-mview-optimized.service.ts`: Optimized SQL Window Functions & Materialized View querying/refreshing.
- `src/modules/db-window-mview/controllers/db-window-mview-naive.controller.ts`: Endpoint `GET /api/v1/db-window-mview/naive/analytics`.
- `src/modules/db-window-mview/controllers/db-window-mview-optimized.controller.ts`: Endpoints `GET /api/v1/db-window-mview/optimized/analytics/window`, `GET /.../mview`, and `POST /.../mview/refresh`.
- `src/modules/db-window-mview/db-window-mview.module.ts`: NestJS module declaration.
- `src/modules/db-window-mview/postman/db-window-mview-postman-collection.json`: Postman collection testing analytics and view refresh.
- `src/modules/db-window-mview/README.md`: Technical documentation detailing Window Functions and Materialized View mechanics.

## 3. Implementation Steps & Sequencing
1. Define DTOs & response envelope contracts measuring `heapUsedMb` and `executionTimeMs`.
2. Implement `DbWindowMviewNaiveService` & `DbWindowMviewNaiveController` executing in-memory JS array loops.
3. Implement `DbWindowMviewOptimizedService` & `DbWindowMviewOptimizedController` executing SQL Window Functions and Materialized View creation/refresh.
4. Register `DbWindowMviewModule` in NestJS `AppModule`.
5. Create Postman Collection artifact and module README.
6. Verify TypeScript compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
