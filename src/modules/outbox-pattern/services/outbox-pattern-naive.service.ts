import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxOrderEntity } from '../entities/outbox-order.entity';
import { CreateOutboxOrderDto } from '../dto/create-outbox-order.dto';
import { OutboxOrderResult } from '../interfaces/outbox-pattern.interface';

@Injectable()
export class OutboxPatternNaiveService {
  constructor(
    @InjectRepository(OutboxOrderEntity)
    private readonly orderRepo: Repository<OutboxOrderEntity>,
  ) {}

  async createOrderNaive(dto: CreateOutboxOrderDto): Promise<OutboxOrderResult> {
    const startMs = performance.now();
    const orderNumber = `ORD_NAIVE_${Date.now()}`;
    const amount = Number(dto.amount) || 349.50;

    // STEP 1: Save Order in Database (Committed first)
    const order = this.orderRepo.create({
      orderNumber,
      customerId: dto.customerId || 'CUST_7712',
      amount,
      status: 'CREATED',
    });
    const savedOrder = await this.orderRepo.save(order);

    // STEP 2: Separate I/O call attempting direct broker publication (Dual-Write Risk)
    let eventPublishedToBroker = false;
    if (dto.simulateBrokerFailure) {
      // Network failure during broker publish leaves orphan order in DB without notification!
      const executionTimeMs = Number((performance.now() - startMs).toFixed(3));
      throw new InternalServerErrorException(
        `[Dual-Write Failure] DB order ${savedOrder.id} saved, but message broker publish FAILED! Data inconsistency created.`,
      );
    } else {
      eventPublishedToBroker = true;
    }

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      success: true,
      orderId: savedOrder.id,
      orderNumber: savedOrder.orderNumber,
      amount: Number(savedOrder.amount),
      eventPublishedToBroker,
      performance: {
        executionTimeMs,
        strategy: 'UNSAFE_DUAL_WRITE',
        description: 'Order saved in DB, direct broker send executed separately; high risk of orphan DB state on broker failure',
      },
    };
  }
}
