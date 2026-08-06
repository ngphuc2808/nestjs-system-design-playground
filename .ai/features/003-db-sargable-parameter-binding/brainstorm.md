---
feature: "003-db-sargable-parameter-binding"
created: "2026-08-05"
---

# Brainstorm — db-sargable-parameter-binding

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 1.2 (Sargable Queries & Parameter Plan Caching) demonstrates two critical SQL query optimization principles in PostgreSQL:
1. **Sargable vs Non-Sargable Queries (Search Argument Able)**:
   - **Non-Sargable (`naive`)**: Wrapping columns in functions like `WHERE DATE(created_at) = '2026-08-05'` or leading wildcards `WHERE username LIKE '%john'` forces a full Sequential Scan, invalidating B-Tree indexes.
   - **Sargable (`optimized`)**: Using explicit range conditions `WHERE created_at >= '2026-08-05 00:00:00' AND created_at < '2026-08-06 00:00:00'` or prefix search `WHERE username LIKE 'john%'` enables B-Tree Index Range Scans.
2. **Parameter Binding & Prepared Statement Plan Caching**:
   - **String Concatenation (`naive`)**: Dynamically interpolating string values into raw SQL queries forces PostgreSQL to re-parse, re-analyze, and re-plan every single execution, wasting CPU under high CCU.
   - **Prepared Statements (`optimized`)**: Parameterized queries using `$1`, `$2` allow PostgreSQL to cache query execution plans (`Prepared Statement Plan Cache`), reducing CPU overhead and completely eliminating SQL Injection risks.

### Key Value & Objectives
- **Empirical Demonstration**: Benchmark endpoints returning execution time (ms), query plan scan type (`Seq Scan` vs `Index Range Scan`), and CPU plan compilation costs.
- **Dual Controllers**:
  - `DbSargableNaiveController`: `/api/v1/db-sargable/naive/search`
  - `DbSargableOptimizedController`: `/api/v1/db-sargable/optimized/search`

### Architectural & Module Boundaries
- Code location: `src/modules/db-sargable/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- DB Engine: PostgreSQL 16 via TypeORM / Raw `pg` driver
