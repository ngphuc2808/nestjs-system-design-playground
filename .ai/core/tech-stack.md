---
provenance: manual
confidence: high
last_verified: "2026-08-05"
dependencies:
  - name: "@nestjs/core"
    version: "^11.0.0"
  - name: typeorm
    version: "^0.3.20"
  - name: pg
    version: "^8.13.0"
  - name: ioredis
    version: "^5.4.0"
  - name: kafkajs
    version: "^2.2.4"
  - name: amqplib
    version: "^0.10.4"
  - name: bullmq
    version: "^5.25.0"
---

# Tech Stack

## Languages & Runtimes
- **Node.js**: v20+ LTS
- **TypeScript**: v5.7+

## Frameworks
- **NestJS**: v11 (Modular Monolith architecture, Dependency Injection, Guards, Interceptors)

## Key Libraries & Tools
- **Data Access / ORM**: TypeORM / Raw SQL with `pg` driver
- **In-Memory & Cache**: Redis via `ioredis` (Lua scripts, Atomic operations)
- **Messaging & Queues**:
  - Apache Kafka (`kafkajs`)
  - RabbitMQ (`amqplib`)
  - BullMQ (`bullmq`)
- **Utility / Streaming**: `csv-parser` / Node.js native streams pipeline

## Infrastructure & Hosting
- **Local Environment**: Docker & Docker Compose (PostgreSQL 16, Redis 7, Kafka + Zookeeper / KRaft, RabbitMQ management, PgBouncer)
- **API Testing**: Postman collections per module

## Development & Code Quality
- **Package Manager**: `pnpm`
- **Linting & Formatting**: ESLint, Prettier
