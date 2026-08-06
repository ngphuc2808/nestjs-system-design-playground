import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ProduceOrderEventDto } from '../dto/produce-order-event.dto';
import { ProduceEventResult } from '../interfaces/kafka-core.interface';

@Injectable()
export class KafkaCoreNaiveService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private isConnected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-playground-naive-producer',
      brokers: [(process.env.KAFKA_BROKER || 'localhost:9092')],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.isConnected = true;
    } catch {
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.producer.disconnect();
    }
  }

  async produceNaive(dto: ProduceOrderEventDto): Promise<ProduceEventResult> {
    const startMs = performance.now();
    const topic = 'benchmark.order.events';
    const orderId = dto.orderId || 'ORD_9901';
    const eventType = dto.eventType || 'ORDER_CREATED';

    if (!this.isConnected) {
      try {
        await this.producer.connect();
        this.isConnected = true;
      } catch {
        // Fallback simulation mode if Kafka broker is unavailable
        const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
        return {
          success: true,
          topic,
          partition: Math.floor(Math.random() * 3),
          offset: `${Math.floor(Math.random() * 1000)}`,
          orderId,
          eventType,
          key: null,
          performance: {
            executionTimeMs,
            strategy: 'UNKEYED_RANDOM_ROUND_ROBIN',
            description: 'Fallback simulation: Unkeyed event scattered randomly across partitions (No ordering guarantee)',
          },
        };
      }
    }

    // NAIVE UNKEYED PRODUCER: key = null scatters messages across partitions in round-robin!
    const recordMetadata = await this.producer.send({
      topic,
      messages: [
        {
          key: null,
          value: JSON.stringify({
            orderId,
            eventType,
            amount: dto.amount || 299.99,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
    const meta = recordMetadata[0];

    return {
      success: true,
      topic: meta.topicName,
      partition: meta.partition,
      offset: meta.baseOffset || '0',
      orderId,
      eventType,
      key: null,
      performance: {
        executionTimeMs,
        strategy: 'UNKEYED_RANDOM_ROUND_ROBIN',
        description: 'Unkeyed message (key=null) scattered across partitions in round-robin; out-of-order consumption risk!',
      },
    };
  }
}
