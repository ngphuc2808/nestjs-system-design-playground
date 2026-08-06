---
date: 2026-08-06
slug: docsify-documentation-portal
status: active
---

# Feature Brainstorm: Migrate Web Documentation Portal to Docsify CLI

## What is this feature?
Migrate or integrate Docsify (`docsify-cli`) into the project's documentation architecture to serve project documentation directly from Markdown files (`.md`), enabling standard Docsify full-text search, sidebar navigation, code copy, and Markdown rendering while preserving NestJS API documentation integration.

## Why does it matter?
Currently, our documentation portal (`GET /docs`) is rendered via an inline HTML/CSS template in NestJS (`docs-template.html.ts`). While it provides a custom glassmorphic UI, Docsify provides a standardized Markdown-driven documentation engine with zero build steps, making it much easier to write, extend, and search docs without updating NestJS TS code.

## Rough shape of the approach
1. **Docsify Setup**: Initialize a `/docs` or `.ai/docs` Markdown directory structure with `index.html`, `_sidebar.md`, and module `.md` files.
2. **Serving Docsify**: Configure NestJS (`ServeStaticModule` or custom controller) to serve Docsify static content at `/docs`.
3. **Markdown Architecture Docs**: Generate dedicated Markdown documentation pages for each System Design module (Phase 1 to Phase 4) covering Naive vs Optimized benchmarks, EXPLAIN ANALYZE SQL, and cURL snippets.
4. **Docsify Plugins**: Integrate Docsify search, prismjs code highlighting, and copy-code plugins.
