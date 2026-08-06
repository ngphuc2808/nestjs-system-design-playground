---
feature: "003-db-sargable-parameter-binding"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — db-sargable-parameter-binding

## 1. Overview & Architecture Approach
Module 1.2 demonstrates two critical PostgreSQL query optimization concepts:
1. **Sargable vs Non-Sargable Queries**: Contrast function-wrapped column conditions (`WHERE DATE(created_at) = '2026-08-05'`) causing full Sequential Scans against index-sargable range expressions (`WHERE created_at >= '2026-08-05 00:00:00' AND created_at < '2026-08-06 00:00:00'`) utilizing B-Tree Index Range Scans.
2. **Prepared Statement Plan Caching**: Contrast raw string interpolation (`WHERE username = '${name}'`) forcing PostgreSQL to re-parse and re-plan query trees against parameterized queries (`WHERE username = $1`) benefiting from PostgreSQL Prepared Statement Plan Caching.

## 2. Components & Files Touched
- `src/modules/db-sargable/dto/`: DTOs for `SearchDateDto` and `SearchUserDto`.
- `src/modules/db-sargable/interfaces/db-sargable.interface.ts`: Data response envelope and scan performance metrics contracts.
- `src/modules/db-sargable/services/db-sargable-naive.service.ts`: Naive implementations (Non-Sargable `DATE()` function wrapper & String Concatenation queries).
- `src/modules/db-sargable/services/db-sargable-optimized.service.ts`: Optimized implementations (Sargable explicit date range & `$1` Prepared Statement Parameter Binding).
- `src/modules/db-sargable/controllers/db-sargable-naive.controller.ts`: Endpoints `GET /api/v1/db-sargable/naive/date-search` and `GET /api/v1/db-sargable/naive/raw-string`.
- `src/modules/db-sargable/controllers/db-sargable-optimized.controller.ts`: Endpoints `GET /api/v1/db-sargable/optimized/date-range` and `GET /api/v1/db-sargable/optimized/parameter-binding`.
- `src/modules/db-sargable/db-sargable.module.ts`: NestJS module declaration.
- `src/modules/db-sargable/postman/db-sargable-postman-collection.json`: Postman collection testing naive vs optimized endpoints.
- `src/modules/db-sargable/README.md`: Technical documentation detailing Sargable rules and prepared statement plan cache metrics.

## 3. Implementation Steps & Sequencing
1. Define DTOs & response envelope interfaces in `src/modules/db-sargable/`.
2. Implement `DbSargableNaiveService` & `DbSargableNaiveController` targeting `benchmark_users`.
3. Implement `DbSargableOptimizedService` & `DbSargableOptimizedController` utilizing range expressions and prepared statement parameters.
4. Register `DbSargableModule` in NestJS `AppModule`.
5. Create Postman Collection artifact and module README.
6. Verify TypeScript compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
