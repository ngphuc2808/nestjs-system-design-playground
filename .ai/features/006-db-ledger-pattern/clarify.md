---
feature: "006-db-ledger-pattern"
---

# Clarify — db-ledger-pattern

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | How is the cryptographic hash chain calculated for each financial ledger transaction? | resolved | `hash = SHA256(previousHash + accountId + amount + type + createdAt)`. Genesis block uses a fixed 64-zero string `0000000000000000000000000000000000000000000000000000000000000000`. |
| 2 | How does the integrity verification scan detect tampered or altered transactions? | resolved | `GET /api/v1/db-ledger/verify` iterates through all ledger rows, re-computes expected hashes, and returns `isValid: false` along with tampered row IDs if hashes mismatch. |
| 3 | How is database-level immutability enforced against UPDATE or DELETE operations? | resolved | PostgreSQL DB rules `CREATE RULE no_ledger_update AS ON UPDATE DO INSTEAD NOTHING` and `CREATE RULE no_ledger_delete AS ON DELETE DO INSTEAD NOTHING`. |
