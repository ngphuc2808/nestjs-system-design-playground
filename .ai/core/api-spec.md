---
provenance: manual
status: rest
variant: rest
last_verified: "2026-08-05"
---

# API Specification & Conventions

## Architecture & Style
- **Protocol**: RESTful JSON HTTP APIs
- **Base Prefix**: `/api/v1`

## Dual Endpoint Pattern
For each learning module feature, endpoints are exposed under two distinct paths to enable side-by-side benchmarking:
- Naive Endpoints: `/api/v1/<feature>/naive/...`
- Optimized Endpoints: `/api/v1/<feature>/optimized/...`

## Postman Integration
- Standardized Postman Collections located in `src/modules/<feature-name>/postman/<feature>-postman-collection.json`.

## Core System Endpoints
- **Progress Tracking**:
  - `GET /api/v1/learning-progress/summary`: Fetch status, notes, and latency comparisons across all topics.
  - `PATCH /api/v1/learning-progress/:topicId`: Update status (`TODO` | `IN_PROGRESS` | `COMPLETED`), key takeaways, and latency metrics.
