---
provenance: reverse-search
scanned_at: "2026-08-06"
confidence: high
---

# Tech Stack — NestJS Playground

## Core Runtime & Framework
- **Node.js**: v22.x LTS
- **NestJS**: v11.0.1
- **TypeScript**: v5.7.3
- **Package Manager**: pnpm

## Storage & Databases
- **PostgreSQL**: 16-alpine (Port 5432, TypeORM v1.1.0)
- **Redis**: 7-alpine (Port 6379, ioredis v6.0.0, Lua Scripts)
- **PgBouncer**: Connection pooler

## Messaging & Queues
- **Apache Kafka**: KRaft mode (Port 9092, kafkajs v2.2.4)
- **RabbitMQ**: 3-management (Port 5672, amqplib v2.0.1)
- **BullMQ**: v6.0.7 (Redis-backed job queue)

## Utilities & Testing
- **Jest**: v30.0.0 (Unit & E2E Testing)
- **Postman**: Collections under `src/modules/<module-name>/postman/`
- **pg**: v8.22.0 (Direct Node PostgreSQL client for bulk seeding)
