import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountBalanceEntity } from './entities/account-balance.entity';
import { LedgerTransactionEntity } from './entities/ledger-transaction.entity';
import { DbLedgerNaiveService } from './services/db-ledger-naive.service';
import { DbLedgerOptimizedService } from './services/db-ledger-optimized.service';
import { DbLedgerNaiveController } from './controllers/db-ledger-naive.controller';
import { DbLedgerOptimizedController } from './controllers/db-ledger-optimized.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountBalanceEntity, LedgerTransactionEntity])],
  controllers: [DbLedgerNaiveController, DbLedgerOptimizedController],
  providers: [DbLedgerNaiveService, DbLedgerOptimizedService],
  exports: [DbLedgerNaiveService, DbLedgerOptimizedService],
})
export class DbLedgerModule {}
