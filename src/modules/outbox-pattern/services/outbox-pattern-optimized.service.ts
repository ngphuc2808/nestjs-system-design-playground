import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OutboxOrderEntity } from '../entities/outbox-order.entity';
import { OutboxEventEntity } from '../entities/outbox-event.entity';
import { CreateOutboxOrderDto } from '../dto/create-outbox-order.dto';
import { OutboxOrderResult, RelayTriggerResult } from '../interfaces/outbox-pattern.interface';

@Injectable()
export class OutboxPatternOptimizedService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OutboxEventEntity)
    private readonly eventRepo: Repository<OutboxEventEntity>,
  ) {}

  async createOrderOptimized(dto: CreateOutboxOrderDto): Promise<OutboxOrderResult> {
    const startMs = performance.now();
    const orderNumber = `ORD_OPT_${Date.now()}`;
    const amount = Number(dto.amount) || 349.50;

    // ATOMIC DB TRANSACTION: Both Order and Outbox Event are saved together in 1 single transaction block
    let createdOrderId = '';
    let createdEventId = '';

    await this.dataSource.transaction(async (manager) => {
      // 1. Save Order Entity
      const order = manager.create(OutboxOrderEntity, {
        orderNumber,
        customerId: dto.customerId || 'CUST_7712',
        amount,
        status: 'CREATED',
      });
      const savedOrder = await manager.save(order);
      createdOrderId = savedOrder.id;

      // 2. Save Outbox Event in the same DB transaction
      const outboxEvent = manager.create(OutboxEventEntity, {
        aggregateType: 'ORDER',
        aggregateId: savedOrder.id,
        eventType: 'ORDER_CREATED',
        payload: {
          orderId: savedOrder.id,
          orderNumber: savedOrder.orderNumber,
          customerId: savedOrder.customerId,
          amount: Number(savedOrder.amount),
        },
        status: 'PENDING',
      });
      const savedEvent = await manager.save(outboxEvent);
      createdEventId = savedEvent.id;
    });

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      success: true,
      orderId: createdOrderId,
      orderNumber,
      amount,
      outboxEventId: createdEventId,
      eventPublishedToBroker: false, // Relayed asynchronously by CDC Outbox Poller
      performance: {
        executionTimeMs,
        strategy: 'ATOMIC_TRANSACTIONAL_OUTBOX',
        description: 'Order and Outbox event saved atomically in 1 single DB transaction; zero Dual-Write risk',
      },
    };
  }

  async getOutboxEvents() {
    return this.eventRepo.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async triggerOutboxRelay(): Promise<RelayTriggerResult> {
    const startMs = performance.now();
    let processedCount = 0;
    let failedCount = 0;

    // CDC RELAY POLLER: Query pending events with FOR UPDATE SKIP LOCKED
    await this.dataSource.transaction(async (manager) => {
      const pendingEvents = await manager
        .createQueryBuilder(OutboxEventEntity, 'event')
        .where('event.status = :status', { status: 'PENDING' })
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .take(50)
        .getMany();

      for (const event of pendingEvents) {
        try {
          // Simulate publishing event to Kafka/Broker
          event.status = 'PROCESSED';
          event.processedAt = new Date();
          await manager.save(event);
          processedCount++;
        } catch {
          event.status = 'FAILED';
          await manager.save(event);
          failedCount++;
        }
      }
    });

    const remainingPendingCount = await this.eventRepo.count({ where: { status: 'PENDING' } });
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      processedCount,
      failedCount,
      remainingPendingCount,
      executionTimeMs,
    };
  }
}
