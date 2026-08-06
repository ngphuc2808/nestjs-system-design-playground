---
feature: "006-db-ledger-pattern"
created: "2026-08-05"
---

# Brainstorm — db-ledger-pattern

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 1.5 (Immutable Financial Ledger Pattern) implements an Append-Only immutable ledger audit log in PostgreSQL with cryptographic SHA-256 hash chaining:
1. **Append-Only Immutable Ledger (`optimized`)**:
   - Every financial transaction entry stores a cryptographic hash computed as `SHA-256(previousHash + accountId + amount + type + timestamp)`.
   - Modifying or deleting any historical record breaks the cryptographic chain, making tampering instantly detectable during integrity verification scans (`GET /api/v1/db-ledger/verify`).
   - PostgreSQL rules/triggers prevent `UPDATE` and `DELETE` operations on ledger tables.
2. **Mutable In-Place Balance Updates (`naive`)**:
   - Directly mutating account balance columns via `UPDATE accounts SET balance = balance + X` without immutable transaction audit history, making fraud or unauthorized updates impossible to trace.

### Key Value & Objectives
- **Cryptographic Auditability**: Endpoints to post financial transactions, retrieve account transaction ledgers, and execute cryptographic chain integrity verification.
- **Dual Controllers**:
  - `DbLedgerNaiveController`: `/api/v1/db-ledger/naive/transactions` (In-place mutable balance updates).
  - `DbLedgerOptimizedController`: `/api/v1/db-ledger/optimized/transactions`, `/verify` (Append-only immutable hash chain ledger).

### Architectural & Module Boundaries
- Code location: `src/modules/db-ledger/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `entities/`, `postman/`, `README.md`
- DB Engine: PostgreSQL 16 via TypeORM / Raw SQL driver
