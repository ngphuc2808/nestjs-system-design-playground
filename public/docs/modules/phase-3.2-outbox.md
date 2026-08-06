# ⚡ Module 3.2 — Transactional Outbox Pattern

> **Mục tiêu**: Giải quyết sự cố Dual-Write đảm bảo At-Least-Once Delivery.

```bash
curl -X POST http://localhost:3000/api/v1/outbox-pattern/optimized/create-order \
  -H "Content-Type: application/json" \
  -d '{"customerId":"CUST_88","totalAmount":499.99,"items":["iPhone 16 Pro"]}'
```
