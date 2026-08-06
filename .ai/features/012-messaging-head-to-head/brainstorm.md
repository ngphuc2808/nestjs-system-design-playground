---
feature: "012-messaging-head-to-head"
created: "2026-08-05"
---

# Brainstorm — messaging-head-to-head

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 3.3 (Messaging Head-to-Head Comparison Benchmark) evaluates the architectural trade-offs, throughput (ops/sec), and latency across **Apache Kafka**, **RabbitMQ**, and **Redis BullMQ**:
1. **Generic Single-Queue Producer (`naive`)**:
   - `POST /api/v1/messaging-comparison/naive/publish`: Basic serial message dispatch without performance metrics or broker trade-off comparison.
2. **Comprehensive Head-to-Head Benchmark (`optimized`)**:
   - **Kafka (`KafkaEngine`)**: Log-centric distributed streaming engine built for massive event throughput (100k+ msg/sec), partition replayability, and horizontal scaling.
   - **RabbitMQ (`RabbitMQEngine`)**: Advanced AMQP message broker supporting flexible routing (Direct, Fanout, Topic, Headers), delayed messages, and per-message ACKs.
   - **BullMQ (`BullMQEngine`)**: Redis-backed job queue offering delayed jobs, retries, concurrency controls, and seamless NestJS/Node.js ecosystem integration.
   - Comparative benchmark execution endpoint `POST /api/v1/messaging-comparison/optimized/benchmark` and summary endpoint `GET /api/v1/messaging-comparison/optimized/comparison-matrix`.

### Key Value & Objectives
- **System Design Trade-off Insights**: Quantifying throughput (msg/sec), p95/p99 latency (ms), and architectural use-cases across Kafka, RabbitMQ, and BullMQ.
- **Dual Controllers**:
  - `MessagingComparisonNaiveController`: `/api/v1/messaging-comparison/naive/publish`.
  - `MessagingComparisonOptimizedController`: `/api/v1/messaging-comparison/optimized/benchmark`, `/comparison-matrix`, `/kafka/publish`, `/rabbitmq/publish`, `/bullmq/publish`.

### Architectural & Module Boundaries
- Code location: `src/modules/messaging-comparison/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- Infrastructure: Kafka (`localhost:9092`), RabbitMQ (`localhost:5672`), Redis (`localhost:6379`)
