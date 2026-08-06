---
feature: "005-db-window-functions-materialized-views"
status: approved
generated_from_plan_version: 1
tasks:
  - id: T1
    depends_on: []
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T2
    depends_on: [T1]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T3
    depends_on: [T2]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T4
    depends_on: [T3]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
  - id: T5
    depends_on: [T4]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-05"
---

# Tasks — db-window-functions-materialized-views

## Core Implementation Checklist

- [x] [T1] Define DTOs (`AnalyticsQueryDto`) and response envelope interfaces measuring `heapUsedMb` in `src/modules/db-window-mview/`
- [x] [T2] Implement `DbWindowMviewNaiveService` and `DbWindowMviewNaiveController` executing in-memory JS array analytics (depends: T1)
- [x] [T3] Implement `DbWindowMviewOptimizedService` and `DbWindowMviewOptimizedController` for SQL Window Functions and Materialized View concurrent refresh (depends: T2)
- [x] [T4] Register `DbWindowMviewModule` in NestJS `AppModule` and verify build compilation (depends: T3)
- [x] [T5] Create Postman Collection artifact, Module README documentation, and verify benchmark endpoints (depends: T4)
