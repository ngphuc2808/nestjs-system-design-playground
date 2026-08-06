# ⚡ Module 2.3 — Idempotency Key & DB Connection Pool

> **Mục tiêu**: Chống quẹt thẻ trùng lặp và tối ưu hóa PostgreSQL Connection Pooling.

---

## 🛠️ API Endpoint Snippet

```bash
curl -X POST http://localhost:3000/api/v1/idempotency-pool/optimized/payment \
  -H "Content-Type: application/json" \
  -H "x-idempotency-key: PAY_KEY_9981" \
  -d '{"accountId":"ACC_1001","amount":500}'
```
