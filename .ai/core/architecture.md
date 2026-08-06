---
provenance: manual
confidence: high
last_verified: "2026-08-05"
---

# Architecture

## System Overview
NestJS Modular Monolith designed as a local-first system design playground to benchmark and compare `naive` vs `optimized` implementations across database query optimization, high-concurrency locking, messaging streams, and traffic engineering.

### Frontend Architecture
Status: Not Applicable
Reason: Local-first backend API playground tested via Postman collections and API requests.

### Backend Architecture
- **Framework**: NestJS (TypeScript) Modular Monolith
- **Module Structure**: Standardized per feature under `src/modules/<feature-name>/`:
  - `controllers/`: `naive.controller.ts` & `optimized.controller.ts`
  - `services/`: `naive.service.ts` & `optimized.service.ts`
  - `interfaces/`: Swappable contracts (DIP / ISP)
  - `dto/` & `entities/` (or `repositories/`)
  - `postman/`: Isolated Postman collection JSON
  - `README.md`: Technical documentation & benchmark breakdown
- **Design Patterns**: SOLID principles, Strategy/Factory pattern for broker/caching adapters, Outbox Pattern for eventual consistency, Ledger pattern for immutable auditing.

### Infrastructure Architecture
- **Execution Environment**: Local Node.js runtime + Docker Compose
- **Services Containers**: PostgreSQL 16, Redis 7, Apache Kafka, RabbitMQ, PgBouncer

### External Integrations
- None (Local-first mindset with postman collections).
