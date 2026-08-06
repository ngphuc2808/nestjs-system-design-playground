---
feature: "007-concurrency-locking-strategies"
created: "2026-08-05"
---

# Brainstorm — concurrency-locking-strategies

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 2.1 (Concurrency Control & Locking Strategies) demonstrates high-concurrency race condition safety across inventory deduction and account balance transfers:
1. **Unprotected Concurrent Read-Modify-Write (`naive`)**:
   - `SELECT stock FROM inventory WHERE id = X` followed by `UPDATE inventory SET stock = stock - 1`.
   - Under 500 concurrent requests, causes severe **Lost Updates** and inventory overbooking (negative stock balances).
2. **Optimistic Locking with Version Column (`optimized`)**:
   - `UPDATE inventory SET stock = stock - 1, version = version + 1 WHERE id = X AND version = @currentVersion`.
   - Prevents lost updates with high throughput for low-conflict scenarios; fails fast if version changed.
3. **Pessimistic Locking (`FOR UPDATE` / `FOR NO KEY UPDATE`) (`optimized`)**:
   - `SELECT stock FROM inventory WHERE id = X FOR UPDATE`.
   - Locks target row at database level, serializing concurrent writes and guaranteeing zero overbooking.
4. **PostgreSQL Advisory Locks (`pg_advisory_xact_lock`) (`optimized`)**:
   - Session/transaction-level application locks in PostgreSQL (`pg_advisory_xact_lock(hashtext('product_1001'))`) for application-defined critical sections without locking entire database tables.

### Key Value & Objectives
- **Concurrency Load Test Endpoints**:
  - `POST /api/v1/concurrency-locking/naive/deduct` (Demonstrates lost updates / overbooking).
  - `POST /api/v1/concurrency-locking/optimized/deduct/optimistic` (Version column OCC).
  - `POST /api/v1/concurrency-locking/optimized/deduct/pessimistic` (Pessimistic `FOR UPDATE`).
  - `POST /api/v1/concurrency-locking/optimized/deduct/advisory` (PostgreSQL `pg_advisory_xact_lock`).
  - `POST /api/v1/concurrency-locking/seed` (Resets inventory stock for testing).

### Architectural & Module Boundaries
- Code location: `src/modules/concurrency-locking/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `entities/`, `postman/`, `README.md`
- DB Engine: PostgreSQL 16 via TypeORM / Raw SQL driver
