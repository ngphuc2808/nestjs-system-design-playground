import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LearningProgressModule } from './modules/learning-progress/learning-progress.module';
import { DbPaginationModule } from './modules/db-pagination/db-pagination.module';
import { DbSargableModule } from './modules/db-sargable/db-sargable.module';
import { DbIndexingModule } from './modules/db-indexing/db-indexing.module';
import { DbWindowMviewModule } from './modules/db-window-mview/db-window-mview.module';
import { DbLedgerModule } from './modules/db-ledger/db-ledger.module';
import { ConcurrencyLockingModule } from './modules/concurrency-locking/concurrency-locking.module';
import { RedisLuaModule } from './modules/redis-lua/redis-lua.module';
import { IdempotencyPoolModule } from './modules/idempotency-pool/idempotency-pool.module';
import { KafkaCoreModule } from './modules/kafka-core/kafka-core.module';
import { OutboxPatternModule } from './modules/outbox-pattern/outbox-pattern.module';
import { MessagingComparisonModule } from './modules/messaging-comparison/messaging-comparison.module';
import { TrafficEngineeringModule } from './modules/traffic-engineering/traffic-engineering.module';
import { FileStreamingModule } from './modules/file-streaming/file-streaming.module';
import { UserBenchmarkEntity } from './modules/db-pagination/entities/user-benchmark.entity';
import { IndexingOrderEntity } from './modules/db-indexing/entities/indexing-order.entity';
import { AccountBalanceEntity } from './modules/db-ledger/entities/account-balance.entity';
import { LedgerTransactionEntity } from './modules/db-ledger/entities/ledger-transaction.entity';
import { ProductInventoryEntity } from './modules/concurrency-locking/entities/product-inventory.entity';
import { OutboxOrderEntity } from './modules/outbox-pattern/entities/outbox-order.entity';
import { OutboxEventEntity } from './modules/outbox-pattern/entities/outbox-event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgrespassword',
      database: process.env.DB_NAME || 'nestjs_playground',
      entities: [
        UserBenchmarkEntity,
        IndexingOrderEntity,
        AccountBalanceEntity,
        LedgerTransactionEntity,
        ProductInventoryEntity,
        OutboxOrderEntity,
        OutboxEventEntity,
      ],
      synchronize: true,
    }),
    LearningProgressModule,
    DbPaginationModule,
    DbSargableModule,
    DbIndexingModule,
    DbWindowMviewModule,
    DbLedgerModule,
    ConcurrencyLockingModule,
    RedisLuaModule,
    IdempotencyPoolModule,
    KafkaCoreModule,
    OutboxPatternModule,
    MessagingComparisonModule,
    TrafficEngineeringModule,
    FileStreamingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
