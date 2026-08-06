---
feature: "004-db-advanced-indexing-explain"
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

# Tasks — db-advanced-indexing-explain

## Core Implementation Checklist

- [x] [T1] Create `IndexingOrderEntity` with B-Tree Covering, Partial, Composite, and GIN JSONB Indexing in `src/modules/db-indexing/entities/`
- [x] [T2] Define DTOs, response envelope interfaces, and batch seeding endpoint `POST /api/v1/db-indexing/seed` for 100,000 orders (depends: T1)
- [x] [T3] Implement `DbIndexingNaiveService` and `DbIndexingNaiveController` executing queries with Seq Scans and Heap Table fetches (depends: T2)
- [x] [T4] Implement `DbIndexingOptimizedService` and `DbIndexingOptimizedController` for Covering Index Only Scan, Partial Index, Leftmost Seek, and GIN JSONB Containment (depends: T3)
- [x] [T5] Register `DbIndexingModule` in NestJS `AppModule`, create Postman Collection artifact, Module README, and verify build compilation (depends: T4)
