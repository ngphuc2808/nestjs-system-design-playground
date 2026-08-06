import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LearningProgressSummary,
  LearningTopic,
  TopicStatus,
} from '../interfaces/learning-progress.interface';
import { UpdateProgressDto } from '../dto/update-progress.dto';

@Injectable()
export class LearningProgressService {
  private topics: Map<string, LearningTopic> = new Map();

  constructor() {
    this.seedRoadmapTopics();
  }

  private seedRoadmapTopics(): void {
    const initialTopics: Omit<LearningTopic, 'updatedAt'>[] = [
      // Phase 0
      {
        id: 'infra-setup',
        phase: 'Phase 0',
        moduleCode: 'infra',
        title: 'Infrastructure Setup (Docker Compose)',
        description: 'Configure Docker environment for PostgreSQL 16, Redis 7, Kafka KRaft, RabbitMQ, and PgBouncer',
        status: TopicStatus.COMPLETED,
        keyTakeaways: ['Docker Compose orchestrated for local-first system design playground'],
        benchmark: { naiveLatencyMs: null, optimizedLatencyMs: null, naiveRps: null, optimizedRps: null },
      },
      {
        id: 'learning-progress-management',
        phase: 'Phase 0',
        moduleCode: 'module-0',
        title: 'Learning Progress & Roadmap Management',
        description: 'API module for tracking learning status, key takeaways, and latency/RPS benchmark comparisons',
        status: TopicStatus.COMPLETED,
        keyTakeaways: ['SOLID principles applied to progress tracking engine'],
        benchmark: { naiveLatencyMs: null, optimizedLatencyMs: null, naiveRps: null, optimizedRps: null },
      },
      // Phase 1
      {
        id: 'db-pagination-benchmark',
        phase: 'Phase 1',
        moduleCode: 'module-1.1',
        title: 'Pagination Benchmark (Offset vs Deferred Join vs Keyset)',
        description: 'Compare Offset O(N) vs Deferred Join vs Keyset Cursor-based O(1) pagination on 1M+ rows',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Keyset Cursor-based pagination scales O(1) via Index Seeking regardless of offset depth',
          'Deferred Join reduces RAM I/O by fetching PKs before full row joining',
        ],
        benchmark: { naiveLatencyMs: 380, optimizedLatencyMs: 2.1, naiveRps: 15, optimizedRps: 1200, latencyImprovementPercentage: '99.4% faster', rpsImprovementFactor: '80.0x throughput' },
      },
      {
        id: 'db-sargable-parameter-binding',
        phase: 'Phase 1',
        moduleCode: 'module-1.2',
        title: 'Sargable Queries & Parameter Plan Caching',
        description: 'Sargable vs Non-Sargable queries (Index Range Scan vs Seq Scan) and Prepared Statements',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Wrapping columns in functions like DATE(created_at) disables B-Tree Index range scanning',
          'Prepared Statements ($1, $2) allow PostgreSQL query planner to reuse execution plans',
        ],
        benchmark: { naiveLatencyMs: 145, optimizedLatencyMs: 0.8, naiveRps: 50, optimizedRps: 3000, latencyImprovementPercentage: '99.4% faster', rpsImprovementFactor: '60.0x throughput' },
      },
      {
        id: 'db-advanced-indexing-explain',
        phase: 'Phase 1',
        moduleCode: 'module-1.3',
        title: 'Advanced Indexing & EXPLAIN ANALYZE',
        description: 'B-Tree, GIN/GiST, Covering Index INCLUDE, Partial Index, Composite Index, BRIN Index analysis',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Partial Indexes dramatically reduce index size by indexing only active status rows',
          'GIN Indexes enable sub-millisecond JSONB key-value searching',
        ],
        benchmark: { naiveLatencyMs: 220, optimizedLatencyMs: 1.2, naiveRps: 30, optimizedRps: 2500, latencyImprovementPercentage: '99.5% faster', rpsImprovementFactor: '83.3x throughput' },
      },
      {
        id: 'db-window-functions-materialized-views',
        phase: 'Phase 1',
        moduleCode: 'module-1.4',
        title: 'Window Functions & Concurrent Materialized Views',
        description: 'ROW_NUMBER/RANK/LAG/LEAD in DB and Concurrent Materialized View Refreshing',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Executing SQL Window functions avoids pulling raw rows into Node.js V8 memory',
          'REFRESH MATERIALIZED VIEW CONCURRENTLY allows non-blocking analytics reporting',
        ],
        benchmark: { naiveLatencyMs: 650, optimizedLatencyMs: 3.5, naiveRps: 8, optimizedRps: 900, latencyImprovementPercentage: '99.5% faster', rpsImprovementFactor: '112.5x throughput' },
      },
      {
        id: 'db-ledger-pattern',
        phase: 'Phase 1',
        moduleCode: 'module-1.5',
        title: 'Immutable Ledger Pattern (SHA-256 Chaining)',
        description: 'Append-only immutable financial ledger with cryptographic SHA-256 hash chaining',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Append-only immutable ledger prevents silent record tampering',
          'SHA-256 cryptographic hash chaining guarantees audit trail integrity',
        ],
        benchmark: { naiveLatencyMs: 45, optimizedLatencyMs: 4.2, naiveRps: 120, optimizedRps: 1500 },
      },
      // Phase 2
      {
        id: 'concurrency-locking-strategies',
        phase: 'Phase 2',
        moduleCode: 'module-2.1',
        title: 'Concurrency Control & Postgres Advisory Locks',
        description: 'Optimistic Locking version column vs Pessimistic FOR UPDATE vs pg_advisory_xact_lock',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Optimistic Concurrency Control (Version column) prevents lost updates under low collision',
          'Postgres Advisory Locks enable application-level distributed locking inside DB transaction',
        ],
        benchmark: { naiveLatencyMs: 110, optimizedLatencyMs: 8.0, naiveRps: 60, optimizedRps: 850 },
      },
      {
        id: 'redis-lua-rate-limit-flashsale',
        phase: 'Phase 2',
        moduleCode: 'module-2.2',
        title: 'Redis Lua Rate Limiting & Flash Sale Inventory',
        description: 'Sliding Window/Token Bucket rate limiters and atomic inventory reduction lua scripts',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Single atomic Redis Lua script executes Sliding Window Log rate limit without race conditions',
          'DECRBY + bounds check in Redis Lua eliminates DB lock contention and prevents overselling',
        ],
        benchmark: { naiveLatencyMs: 85, optimizedLatencyMs: 0.9, naiveRps: 200, optimizedRps: 25000, latencyImprovementPercentage: '98.9% faster', rpsImprovementFactor: '125.0x throughput' },
      },
      {
        id: 'idempotency-connection-pooling',
        phase: 'Phase 2',
        moduleCode: 'module-2.3',
        title: 'Idempotency Key & PgBouncer Connection Pooling',
        description: 'Redis idempotency token filter and PgBouncer/TypeORM pool optimization under high CCU',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Header x-idempotency-key with Redis atomic SET NX EX blocks concurrent duplicate requests',
          '24-hour response caching guarantees zero double-charging on network retries',
        ],
        benchmark: { naiveLatencyMs: 95, optimizedLatencyMs: 0.8, naiveRps: 180, optimizedRps: 15000, latencyImprovementPercentage: '99.2% faster', rpsImprovementFactor: '83.3x throughput' },
      },
      // Phase 3
      {
        id: 'kafka-partitioning-consumer-groups',
        phase: 'Phase 3',
        moduleCode: 'module-3.1',
        title: 'Kafka Partition Management & Consumer Groups',
        description: 'Partition key hashing ordering, consumer group rebalancing, auto vs manual commit strategies',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Key-based partition routing (key=orderId) guarantees strict per-entity sequential ordering',
          'Manual offset commits (autoCommit: false) prevent message loss during worker crashes',
        ],
        benchmark: { naiveLatencyMs: 35, optimizedLatencyMs: 1.5, naiveRps: 500, optimizedRps: 10000 },
      },
      {
        id: 'transactional-outbox-pattern',
        phase: 'Phase 3',
        moduleCode: 'module-3.2',
        title: 'Transactional Outbox Pattern (Dual-Write Safety)',
        description: 'Dual-write consistency between PostgreSQL and Kafka using DB outbox polling/CDC',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Saving entity & outbox event in 1 single DB transaction guarantees 100% data consistency',
          'CDC Relay Poller with FOR UPDATE SKIP LOCKED ensures At-Least-Once Delivery to Message Broker',
        ],
        benchmark: { naiveLatencyMs: 75, optimizedLatencyMs: 3.2, naiveRps: 250, optimizedRps: 4500 },
      },
      {
        id: 'messaging-head-to-head',
        phase: 'Phase 3',
        moduleCode: 'module-3.3',
        title: 'Messaging Head-to-Head: Kafka vs RabbitMQ vs BullMQ',
        description: 'Order notification comparison benchmark using Kafka vs RabbitMQ DLQ vs BullMQ priority jobs',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Kafka: Log streaming built for massive throughput (100k+ msg/sec) and event replayability',
          'RabbitMQ: Advanced AMQP routing exchanges and per-message ACKs',
          'BullMQ: Redis-backed job queue for delayed tasks & retries in Node.js ecosystem',
        ],
        benchmark: { naiveLatencyMs: 120, optimizedLatencyMs: 1.1, naiveRps: 150, optimizedRps: 18000 },
      },
      // Phase 4
      {
        id: 'traffic-engineering-feature-flags',
        phase: 'Phase 4',
        moduleCode: 'module-4.1',
        title: 'Dynamic Feature Flagging & Shadow Traffic',
        description: 'Consistent hashing percentage rollout feature flags and async shadow traffic mirroring',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Redis dynamic feature flags enable sub-5ms feature toggling without server redeployments',
          'Shadow Traffic (Dark Launching) mirrors real production traffic asynchronously without adding user latency',
        ],
        benchmark: { naiveLatencyMs: 50, optimizedLatencyMs: 0.9, naiveRps: 400, optimizedRps: 20000 },
      },
      {
        id: 'file-stream-processing',
        phase: 'Phase 4',
        moduleCode: 'module-4.2',
        title: 'High-Performance Stream File Processing',
        description: 'Node.js stream pipeline CSV/Excel parser processing 100k+ rows directly to DB without OOM',
        status: TopicStatus.COMPLETED,
        keyTakeaways: [
          'Line-by-line Readline stream processing with Backpressure keeps RAM footprint < 30 MB',
          'Chunked HTTP CSV exports stream data directly without allocating temporary disk files',
        ],
        benchmark: { naiveLatencyMs: 4800, optimizedLatencyMs: 320, naiveRps: 1, optimizedRps: 25, latencyImprovementPercentage: '93.3% faster', rpsImprovementFactor: '25.0x throughput' },
      },
    ];

    const now = new Date().toISOString();
    initialTopics.forEach((t) => {
      this.topics.set(t.id, { ...t, updatedAt: now });
    });
  }

  getSummary(): LearningProgressSummary {
    const list = Array.from(this.topics.values());
    const completed = list.filter((t) => t.status === TopicStatus.COMPLETED).length;
    const inProgress = list.filter((t) => t.status === TopicStatus.IN_PROGRESS).length;
    const todo = list.filter((t) => t.status === TopicStatus.TODO).length;
    const total = list.length;
    const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) + '%' : '0%';

    return {
      totalTopics: total,
      completedTopics: completed,
      inProgressTopics: inProgress,
      todoTopics: todo,
      overallProgressPercentage: percentage,
      topics: list,
    };
  }

  updateTopic(topicId: string, dto: UpdateProgressDto): LearningTopic {
    const topic = this.topics.get(topicId);
    if (!topic) {
      throw new NotFoundException(`Learning topic with ID '${topicId}' not found`);
    }

    if (dto.status) {
      topic.status = dto.status;
    }

    if (dto.keyTakeaways) {
      topic.keyTakeaways = [...new Set([...topic.keyTakeaways, ...dto.keyTakeaways])];
    }

    if (dto.naiveLatencyMs !== undefined) topic.benchmark.naiveLatencyMs = dto.naiveLatencyMs;
    if (dto.optimizedLatencyMs !== undefined) topic.benchmark.optimizedLatencyMs = dto.optimizedLatencyMs;
    if (dto.naiveRps !== undefined) topic.benchmark.naiveRps = dto.naiveRps;
    if (dto.optimizedRps !== undefined) topic.benchmark.optimizedRps = dto.optimizedRps;

    // Calculate metrics improvement if available
    if (topic.benchmark.naiveLatencyMs && topic.benchmark.optimizedLatencyMs) {
      const diff = topic.benchmark.naiveLatencyMs - topic.benchmark.optimizedLatencyMs;
      const pct = ((diff / topic.benchmark.naiveLatencyMs) * 100).toFixed(1);
      topic.benchmark.latencyImprovementPercentage = `${pct}% faster`;
    }

    if (topic.benchmark.naiveRps && topic.benchmark.optimizedRps) {
      const factor = (topic.benchmark.optimizedRps / topic.benchmark.naiveRps).toFixed(1);
      topic.benchmark.rpsImprovementFactor = `${factor}x throughput`;
    }

    topic.updatedAt = new Date().toISOString();
    this.topics.set(topicId, topic);
    return topic;
  }
}
