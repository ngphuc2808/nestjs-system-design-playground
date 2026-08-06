# ⚡ Module 3.3 — Messaging Head-to-Head (Kafka vs RabbitMQ vs BullMQ)

> **Mục tiêu**: Benchmark trực tiếp Throughput & Latency giữa 3 broker.

```bash
curl -X POST http://localhost:3000/api/v1/messaging-comparison/optimized/benchmark \
  -H "Content-Type: application/json" \
  -d '{"totalMessages":1000,"targetBroker":"KAFKA"}'
```
