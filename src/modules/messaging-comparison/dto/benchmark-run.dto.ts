export class BenchmarkRunDto {
  messageCount: number = 1000;
  concurrency: number = 10;
}

export class PublishMessageDto {
  queueOrTopic: string = 'benchmark-queue';
  message: string = 'Test payload data';
}
