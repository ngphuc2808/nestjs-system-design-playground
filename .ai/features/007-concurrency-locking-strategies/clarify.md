---
feature: "007-concurrency-locking-strategies"
---

# Clarify — concurrency-locking-strategies

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Which domain business scenario will be used to demonstrate race conditions and locking strategies? | resolved | E-commerce product inventory stock deduction (`benchmark_products` table with `stock` and `version` columns), tested under concurrent requests. |
| 2 | How will Optimistic Concurrency Control (OCC) handle version mismatch conflicts? | resolved | `UPDATE benchmark_products SET stock = stock - 1, version = version + 1 WHERE id = $1 AND version = $2 AND stock >= 1`. Returns `success: false` and conflict count if another transaction updated `version` first. |
| 3 | How will PostgreSQL Advisory Locks be implemented for application critical sections? | resolved | Execute `SELECT pg_advisory_xact_lock(hashtext('product_' || $1))` inside a DB transaction block to lock the specific product ID until transaction commit/rollback. |
