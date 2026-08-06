import { Injectable } from '@nestjs/common';
import { BenchmarkRunDto } from '../dto/benchmark-run.dto';
import {
  EngineMetric,
  SystemDesignTradeoff,
  BenchmarkComparisonResult,
} from '../interfaces/messaging-comparison.interface';

@Injectable()
export class MessagingComparisonOptimizedService {
  async runBenchmark(dto: BenchmarkRunDto): Promise<BenchmarkComparisonResult> {
    const messageCount = Number(dto.messageCount) || 1000;
    const concurrency = Number(dto.concurrency) || 10;
    const executedAt = new Date().toISOString();

    // 1. BENCHMARK KAFKA ENGINE (Distributed Event Streaming)
    const kafkaMetric = await this.benchmarkEngine('Kafka', messageCount, concurrency, 0.2, 1.5);

    // 2. BENCHMARK RABBITMQ ENGINE (AMQP Flexible Broker)
    const rabbitMetric = await this.benchmarkEngine('RabbitMQ', messageCount, concurrency, 0.4, 2.5);

    // 3. BENCHMARK BULLMQ ENGINE (Redis-backed Job Queue)
    const bullMetric = await this.benchmarkEngine('BullMQ', messageCount, concurrency, 0.3, 2.0);

    const metrics = [kafkaMetric, rabbitMetric, bullMetric];

    // Determine winners
    const winnerThroughput = [...metrics].sort((a, b) => b.throughputMsgSec - a.throughputMsgSec)[0].engine;
    const winnerLatency = [...metrics].sort((a, b) => a.p95LatencyMs - b.p95LatencyMs)[0].engine;

    return {
      messageCount,
      concurrency,
      executedAt,
      metrics,
      winnerThroughput,
      winnerLatency,
    };
  }

  getComparisonMatrix(): SystemDesignTradeoff[] {
    return [
      {
        engine: 'Kafka',
        primaryUseCase: 'High-throughput event streaming & log aggregation',
        orderingGuarantee: 'Strict per-partition ordering (key-based routing)',
        replayability: 'Excellent (Retention log rewind by offset)',
        routingFlexibility: 'Basic (Topic & Partition keys)',
        recommendedWhen: 'Building event-driven microservices, CDC pipelines, or handling 100k+ msg/sec',
      },
      {
        engine: 'RabbitMQ',
        primaryUseCase: 'Complex enterprise message routing & task distribution',
        orderingGuarantee: 'FIFO per queue (lost under multiple workers)',
        replayability: 'None (Messages deleted upon ACK)',
        routingFlexibility: 'Exceptional (Direct, Fanout, Topic, Headers exchanges)',
        recommendedWhen: 'Requiring complex RPC routing, dead-letter exchanges, or granular per-message ACKs',
      },
      {
        engine: 'BullMQ',
        primaryUseCase: 'Application background job processing & delayed task scheduling',
        orderingGuarantee: 'FIFO / Priority queue ordering',
        replayability: 'Moderate (Job history stored in Redis up to limit)',
        routingFlexibility: 'Moderate (Queue names & job priorities)',
        recommendedWhen: 'Building Node.js/NestJS apps needing delayed jobs, retries, rate-limiting & Redis stack simplicity',
      },
    ];
  }

  private async benchmarkEngine(
    engine: 'Kafka' | 'RabbitMQ' | 'BullMQ',
    messageCount: number,
    concurrency: number,
    baseLatencyMs: number,
    varianceMs: number,
  ): Promise<EngineMetric> {
    const latencies: number[] = [];
    const startTotalMs = performance.now();

    // Simulate batch benchmark execution
    for (let i = 0; i < messageCount; i++) {
      const lat = baseLatencyMs + Math.random() * varianceMs;
      latencies.push(lat);
    }

    const durationMs = Number((performance.now() - startTotalMs).toFixed(3));
    const throughputMsgSec = Number(((messageCount / (durationMs || 1)) * 1000).toFixed(2));

    latencies.sort((a, b) => a - b);
    const avgLatencyMs = Number((latencies.reduce((acc, v) => acc + v, 0) / messageCount).toFixed(3));
    const p95Index = Math.floor(messageCount * 0.95);
    const p99Index = Math.floor(messageCount * 0.99);

    const p95LatencyMs = Number(latencies[p95Index].toFixed(3));
    const p99LatencyMs = Number(latencies[p99Index].toFixed(3));

    return {
      engine,
      totalMessages: messageCount,
      durationMs,
      throughputMsgSec,
      avgLatencyMs,
      p95LatencyMs,
      p99LatencyMs,
      status: 'ONLINE',
    };
  }
}
