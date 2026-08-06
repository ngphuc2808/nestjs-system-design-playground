---
provenance: manual
status: ratified
version: 0.1.0
ratified: "2026-08-05"
last_amended: null
---

# NestJS System Design & High-Concurrency Playground Constitution

## Purpose
A local-first NestJS Modular Monolith Playground engineered for deep hands-on learning, empirical benchmarking, and side-by-side comparison (`naive` vs `optimized`) of advanced system architecture, PostgreSQL database optimization, high-concurrency locking, distributed messaging streams, traffic engineering, and performance tracking.

## Core Principles

### 1. Strict SOLID & Clean Architecture
Modules must enforce absolute separation of concerns (SRP) between Controllers, Application Services, Repositories, and Messaging Adapters. High-level domain logic relies on swappable abstractions (`IReadRepository`, `IWriteRepository`, `IEventPublisher`) injected via NestJS IoC (DIP/ISP/OCP).

### 2. Mandatory Dual-Implementation Standard (Naive vs. Optimized)
Every feature module MUST implement two distinct code paths: a `naive` implementation (illustrating performance bottlenecks, unindexed queries, or race conditions) and an `optimized` implementation (production-grade sargable queries, keyset pagination, advisory locking, or outbox streaming).

### 3. Empirical Benchmark & Progress Tracking
All performance claims must be backed by empirical evidence (latency in ms, RPS, and `EXPLAIN ANALYZE` block stats). Every topic's performance delta must be logged into the Learning Progress & Roadmap module.

### 4. Local-First Infrastructure & Postman Verification
All supporting infrastructure (PostgreSQL, Redis, Kafka, RabbitMQ) must run locally via Docker Compose. Every module must provide an isolated, fully executable Postman collection JSON under `src/modules/<feature-name>/postman/`.

### 5. Defensive High Concurrency & Zero Data Loss
All concurrent state-mutating operations must explicitly guard against race conditions using appropriate locking mechanisms (Optimistic, Pessimistic, Postgres Advisory Locks, or atomic Redis Lua Scripts). Financial transactions must adhere to immutable ledger append-only logs.

## Non-Negotiables
- **Standardized Module Layout**: Every module directory must follow `src/modules/<feature-name>/` containing `controllers/`, `services/`, `interfaces/`, `dto/`, `entities/`, `postman/`, and `README.md`.
- **Query Safety**: String concatenation in database queries is strictly forbidden; all database interactions must use parameterized prepared statements and sargable expressions.
- **Transactional Consistency**: Dual-write operations across PostgreSQL and Message Brokers must use the Transactional Outbox Pattern to guarantee consistency.

## Governance
This Constitution is maintained by the Lead Architect / Developer. Any amendments require updating the document version, recording an ADR entry in `.ai/decisions/`, and obtaining explicit developer approval before adoption.

---
**Version**: 0.1.0 | **Ratified**: 2026-08-05 | **Last Amended**: null
