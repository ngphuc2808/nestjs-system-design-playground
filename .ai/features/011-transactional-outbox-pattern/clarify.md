---
feature: "011-transactional-outbox-pattern"
---

# Clarify — transactional-outbox-pattern

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | How will the Dual-Write failure scenario be demonstrated in the Naive endpoint? | resolved | `POST /api/v1/outbox-pattern/naive/create-order` executes DB insert followed by direct broker messaging; simulated network error leaves orphan DB rows with no published events. |
| 2 | How is atomic consistency achieved in the Transactional Outbox pattern? | resolved | Both the order record (`benchmark_orders`) and Outbox event (`benchmark_outbox_events`) are committed inside 1 single PostgreSQL DB transaction block. |
| 3 | How does the Outbox Relay poller process and publish pending events? | resolved | Poller queries `SELECT * FROM benchmark_outbox_events WHERE status = 'PENDING' FOR UPDATE SKIP LOCKED`, publishes events to Kafka, and sets `status = 'PROCESSED'`. |
