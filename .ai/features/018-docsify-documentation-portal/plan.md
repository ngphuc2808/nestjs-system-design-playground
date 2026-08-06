---
feature: "018-docsify-documentation-portal"
version: 1
based_on_clarify: "2026-08-06"
review_decision: proceed_to_task
---

# Plan — docsify-documentation-portal

## Goal
Migrate the Web Documentation Portal from the custom NestJS HTML/CSS template renderer to a full-featured, Markdown-driven **Docsify** documentation portal served directly by NestJS at `/docs`.

## Architecture & Implementation Details

### 1. Static Docs Directory Structure (`public/docs/`)
Create a dedicated Docsify static asset directory:
- `public/docs/index.html`: Docsify root configuration (Dark theme, Search plugin, Copy code plugin, PrismJS syntax highlighter).
- `public/docs/_sidebar.md`: Categorized sidebar navigation covering all 12 modules across Phase 1 to Phase 4.
- `public/docs/_coverpage.md`: Visual cover page for NestJS System Design Playground.
- `public/docs/README.md`: Master portal overview.
- `public/docs/modules/`: Individual rich Markdown documentation pages for each feature module:
  - `phase-1.1-pagination.md`: Detailed Read/Write Pagination Benchmark & SQL EXPLAIN ANALYZE.
  - `phase-1.2-sargable.md`
  - `phase-1.3-indexing.md`
  - `phase-1.4-window-mview.md`
  - `phase-1.5-ledger.md`
  - `phase-2.1-concurrency.md`
  - `phase-2.2-redis-lua.md`
  - `phase-2.3-idempotency.md`
  - `phase-3.1-kafka.md`
  - `phase-3.2-outbox.md`
  - `phase-3.3-messaging.md`
  - `phase-4.1-traffic.md`
  - `phase-4.2-file-streaming.md`

### 2. NestJS Static Serving Integration
- Install `@nestjs/serve-static` package.
- Register `ServeStaticModule` in `src/app.module.ts` pointing to `public/docs` at path `/docs`.
- Refactor `SystemDocsController` to keep `GET /api/v1/system-docs/modules` REST API intact for JSON clients, while allowing NestJS ServeStatic to serve `/docs` HTML & Markdown assets.

## Verification Plan
1. `pnpm run build`: Verify TypeScript compilation without errors.
2. `curl -I http://localhost:3000/docs/`: Verify HTTP 200 OK returning Docsify `index.html`.
3. `curl -I http://localhost:3000/docs/_sidebar.md`: Verify Docsify sidebar Markdown file serving.
