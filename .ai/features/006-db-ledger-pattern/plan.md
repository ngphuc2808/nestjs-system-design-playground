---
feature: "006-db-ledger-pattern"
version: 1
based_on_clarify: "2026-08-05"
review_decision: proceed_to_task
---

# Plan — db-ledger-pattern

## 1. Overview & Architecture Approach
Module 1.5 implements an Append-Only Immutable Financial Ledger Pattern with SHA-256 cryptographic hash chaining:
1. **Naive In-Place Updates (`naive`)**: Dynamically modifying account balance values via `UPDATE accounts SET balance = balance + X` without immutable transaction history logs, allowing untraceable balance tampering.
2. **Immutable Append-Only Ledger (`optimized`)**: Recording immutable debit/credit entries in a ledger table (`benchmark_ledger_transactions`) where each entry stores a cryptographic hash computed as `SHA256(previousHash + accountId + amount + type + createdAt)`. Modifying any historical row breaks the hash chain, enabling instant detection via `GET /api/v1/db-ledger/verify`.

## 2. Components & Files Touched
- `src/modules/db-ledger/entities/account-balance.entity.ts`: Account balance entity for naive in-place updates.
- `src/modules/db-ledger/entities/ledger-transaction.entity.ts`: Immutable transaction ledger entity with cryptographic `currentHash` and `previousHash` columns.
- `src/modules/db-ledger/dto/`: DTOs for `TransferTransactionDto` and `TamperLedgerDto`.
- `src/modules/db-ledger/interfaces/db-ledger.interface.ts`: Ledger verification and transaction audit response envelopes.
- `src/modules/db-ledger/services/db-ledger-naive.service.ts`: Naive mutable in-place balance updates.
- `src/modules/db-ledger/services/db-ledger-optimized.service.ts`: Optimized append-only SHA-256 hash chaining, verification scan, and DB-level immutability enforcement.
- `src/modules/db-ledger/controllers/db-ledger-naive.controller.ts`: Endpoint `POST /api/v1/db-ledger/naive/transfer`.
- `src/modules/db-ledger/controllers/db-ledger-optimized.controller.ts`: Endpoints `POST /api/v1/db-ledger/optimized/transfer`, `GET /api/v1/db-ledger/optimized/verify`, `GET /api/v1/db-ledger/optimized/transactions`, and `POST /api/v1/db-ledger/optimized/simulate-tampering`.
- `src/modules/db-ledger/db-ledger.module.ts`: NestJS module declaration.
- `src/modules/db-ledger/postman/db-ledger-postman-collection.json`: Postman collection testing transfer, verification, and tampering detection.
- `src/modules/db-ledger/README.md`: Technical documentation detailing Immutable Ledger patterns and SHA-256 hash chain verification.

## 3. Implementation Steps & Sequencing
1. Define `AccountBalanceEntity` and `LedgerTransactionEntity` with TypeORM.
2. Define DTOs & response envelope contracts in `src/modules/db-ledger/`.
3. Implement `DbLedgerNaiveService` & `DbLedgerNaiveController` (in-place balance updates).
4. Implement `DbLedgerOptimizedService` & `DbLedgerOptimizedController` with crypto SHA-256 chaining and integrity verification scan.
5. Register `DbLedgerModule` in NestJS `AppModule`.
6. Create Postman Collection artifact and module README.
7. Verify TypeScript build compilation (`pnpm run build`) and test endpoints.

## Review Decision

`review_decision`: **proceed_to_task** (Approved on 2026-08-05)
