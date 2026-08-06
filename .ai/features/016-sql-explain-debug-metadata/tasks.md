---
feature: "016-sql-explain-debug-metadata"
status: approved
generated_from_plan_version: 1
tasks:
  - id: T1
    depends_on: []
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-06"
  - id: T2
    depends_on: [T1]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-06"
  - id: T3
    depends_on: [T2]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-06"
  - id: T4
    depends_on: [T3]
    status: done
    locked_by: "macbookpro"
    locked_since: "2026-08-06"
---

# Tasks — sql-explain-debug-metadata

## Core Implementation Checklist

- [x] [T1] Define `SqlDebugMetadata` interface in `src/common/interfaces/sql-debug.interface.ts`
- [x] [T2] Enhance `db-pagination` and `db-sargable` services to return raw SQL and EXPLAIN ANALYZE debug strings in API responses (depends: T1)
- [x] [T3] Enhance `db-indexing`, `db-window-mview`, and `db-ledger` services to return raw SQL and EXPLAIN ANALYZE debug strings (depends: T2)
- [x] [T4] Verify TypeScript compilation, test Postman responses, and verify EXPLAIN ANALYZE strings (depends: T3)
