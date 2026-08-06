---
feature: "014-file-stream-processing"
created: "2026-08-06"
---

# Brainstorm — file-stream-processing

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-06

### Overview & Purpose
Module 4.2 (High-Performance Large File Streaming & Backpressure Processing) demonstrates memory-efficient processing of multi-gigabyte CSV/Excel files:
1. **In-Memory Buffer Allocation (`naive`)**:
   - `POST /api/v1/file-streaming/naive/upload`: Reading entire CSV/Excel files into Node.js V8 RAM buffer (`fs.readFileSync()`), allocating hundreds of megabytes of memory.
   - Triggers `ERR_STRING_TOO_LONG` or `HEAP OUT OF MEMORY` crashes when concurrent users upload large files.
2. **Chunked Node.js Pipeline Streams with Backpressure (`optimized`)**:
   - `POST /api/v1/file-streaming/optimized/stream-upload`: Processing files via `fs.createReadStream()` piped into a `TransformStream` and batch-inserted into PostgreSQL in chunked batches (e.g. 1,000 rows).
   - Utilizes Node.js Stream Backpressure (`pipeline` / highWaterMark) to maintain constant memory consumption (< 30 MB RAM) regardless of file size (100,000+ rows).
   - Also provides streaming export endpoint `GET /api/v1/file-streaming/optimized/export-csv` returning chunked HTTP response.

### Key Value & Objectives
- **Constant Memory Footprint (< 30 MB)**: Zero Out-of-Memory (OOM) crashes when ingesting or exporting 1,000,000+ row datasets.
- **Dual Controllers**:
  - `FileStreamingNaiveController`: `/api/v1/file-streaming/naive/upload`.
  - `FileStreamingOptimizedController`: `/api/v1/file-streaming/optimized/stream-upload`, `/export-csv`.

### Architectural & Module Boundaries
- Code location: `src/modules/file-streaming/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- Infrastructure: Node.js `stream`, `readline`, `pipeline`, PostgreSQL batch inserts via TypeORM / Raw SQL
