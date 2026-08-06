---
feature: "004-db-advanced-indexing-explain"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — db-advanced-indexing-explain

## 1. Overview & Architecture Approach
Module 1.3 explores four PostgreSQL advanced indexing strategies and execution plan analysis (`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`):
1. **Covering Index (`INCLUDE`)**: Storing payload columns inside B-Tree index leaf pages, converting Heap fetches into zero-I/O `Index Only Scan`.
2. **Partial Index**: Indexing a filtered subset of rows (`WHERE status = 'PENDING'`), optimizing memory footprint for queue operations.
3. **Composite Index & Leftmost Prefix Rule**: Demonstrating how leading column selection dictates index scan usage.
4. **GIN Index for JSONB Search**: Containment (`@>`) search over semi-structured JSONB metadata.

## 2. Components & Files Touched
- `src/modules/db-indexing/entities/indexing-order.entity.ts`: Entity definition for `benchmark_indexing_orders` with B-Tree Covering, Partial, Composite, and GIN indexes.
- `src/modules/db-indexing/dto/`: DTOs for `SearchIndexingOrderDto` and `SeedIndexingOrdersDto`.
- `src/modules/db-indexing/interfaces/db-indexing.interface.ts`: Execution plan response envelope and buffer block metrics.
- `src/modules/db-indexing/services/db-indexing-naive.service.ts`: Naive queries triggering full Heap & Seq Scans.
- `src/modules/db-indexing/services/db-indexing-optimized.service.ts`: Optimized queries executing Covering `Index Only Scan`, Partial Index, Leftmost Prefix Seek, and GIN JSONB Containment.
- `src/modules/db-indexing/controllers/db-indexing-naive.controller.ts`: Endpoints `GET /api/v1/db-indexing/naive/covering`, `/partial`, `/leftmost`, `/gin-jsonb`.
- `src/modules/db-indexing/controllers/db-indexing-optimized.controller.ts`: Endpoints `GET /api/v1/db-indexing/optimized/covering`, `/partial`, `/leftmost`, `/gin-jsonb`, and `POST /api/v1/db-indexing/seed`.
- `src/modules/db-indexing/db-indexing.module.ts`: NestJS module wiring TypeORM feature and raw query runners.
- `src/modules/db-indexing/postman/db-indexing-postman-collection.json`: Postman collection testing naive vs optimized execution plans.
- `src/modules/db-indexing/README.md`: Technical documentation detailing EXPLAIN ANALYZE metrics and index mechanics.

## 3. Implementation Steps & Sequencing
1. Define `IndexingOrderEntity` with PostgreSQL GIN and B-Tree indexes.
2. Define DTOs & response envelope interfaces.
3. Implement 100,000 order seeding endpoint (`POST /api/v1/db-indexing/seed`).
4. Implement `DbIndexingNaiveService` & `DbIndexingNaiveController`.
5. Implement `DbIndexingOptimizedService` & `DbIndexingOptimizedController` executing `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`.
6. Register `DbIndexingModule` in NestJS `AppModule`.
7. Create Postman Collection artifact and module README.
8. Verify TypeScript build compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
