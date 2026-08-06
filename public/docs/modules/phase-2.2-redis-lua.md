# ⚡ Module 2.2 — Redis Lua Rate Limiting & Flash Sale (25k RPS)

> **Mục tiêu**: Xử lý Flash Sale và Rate Limiting bằng Redis Lua Script nguyên tử.

---

## 🛠️ Danh Sách API Endpoints (cURL Snippets)

### 1. Optimized Redis Lua Flash Sale (POST)
```bash
curl -X POST http://localhost:3000/api/v1/redis-lua/optimized/flash-sale \
  -H "Content-Type: application/json" \
  -d '{"productId":"FLASH_IPHONE_16","quantity":1}'
```

### 2. Optimized Redis Lua Sliding Window Rate Limit (GET)
```bash
curl -s "http://localhost:3000/api/v1/redis-lua/optimized/rate-limit?key=IP_192_168_1_1&limit=5&windowSeconds=10"
```
