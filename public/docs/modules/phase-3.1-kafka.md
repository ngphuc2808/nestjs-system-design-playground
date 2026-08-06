# ⚡ Module 3.1 — Kafka Partitioning & Consumer Groups

> **Mục tiêu**: Điều hướng Message theo Key đảm bảo thứ tự thời gian 100%.

```bash
curl -X POST http://localhost:3000/api/v1/kafka-core/optimized/produce \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORD_9910","eventType":"ORDER_CREATED","payload":{"amount":150}}'
```
