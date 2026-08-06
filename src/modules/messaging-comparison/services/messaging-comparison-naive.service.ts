import { Injectable } from '@nestjs/common';
import { PublishMessageDto } from '../dto/benchmark-run.dto';

@Injectable()
export class MessagingComparisonNaiveService {
  async publishNaive(dto: PublishMessageDto) {
    const startMs = performance.now();

    // NAIVE PUBLISHER: Basic serial publish without latency tracking or engine trade-off matrix
    const queueOrTopic = dto.queueOrTopic || 'benchmark-queue';
    const payload = dto.message || 'Test payload data';

    // Simulate simple message dispatch
    await new Promise((resolve) => setTimeout(resolve, 10));

    const durationMs = Number((performance.now() - startMs).toFixed(3));

    return {
      success: true,
      queueOrTopic,
      payload,
      durationMs,
      strategy: 'NAIVE_SERIAL_PUBLISH',
      note: 'Basic serial publish; lacks concurrency benchmark, latency percentiles, or broker trade-off matrix',
    };
  }
}
