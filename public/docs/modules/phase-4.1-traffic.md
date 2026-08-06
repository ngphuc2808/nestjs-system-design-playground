# ⚡ Module 4.1 — Dynamic Feature Flags & Shadow Traffic

> **Mục tiêu**: Bật/Tắt Feature & Dark Launching không cần Redeploy.

```bash
curl -X POST http://localhost:3000/api/v1/traffic-engineering/optimized/evaluate \
  -H "Content-Type: application/json" \
  -d '{"flagName":"NEW_CHECKOUT_V2","userId":"USER_5521"}'
```
