import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransferTransactionDto } from '../dto/transfer-transaction.dto';
import { LedgerResponse } from '../interfaces/db-ledger.interface';

@Injectable()
export class DbLedgerNaiveService {
  constructor(private readonly dataSource: DataSource) {}

  async transferNaive(dto: TransferTransactionDto): Promise<LedgerResponse<any>> {
    const startMs = performance.now();
    const accountId = dto.accountId || 'ACC_1001';
    const amount = Number(dto.amount) || 100;
    const delta = dto.type === 'DEBIT' ? -amount : amount;

    // NAIVE MUTABLE UPDATE: Directly mutates account balance column without historical transaction audit logs!
    await this.dataSource.query(
      `
      INSERT INTO benchmark_ledger_accounts (account_id, balance, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (account_id)
      DO UPDATE SET balance = benchmark_ledger_accounts.balance + $3, updated_at = NOW()
    `,
      [accountId, 1000 + delta, delta],
    );

    const updatedAccount = await this.dataSource.query(
      `SELECT account_id AS "accountId", balance, updated_at AS "updatedAt" FROM benchmark_ledger_accounts WHERE account_id = $1`,
      [accountId],
    );

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      data: updatedAccount[0],
      performance: {
        executionTimeMs,
        strategy: 'MUTABLE_IN_PLACE_UPDATE',
        description: 'Direct IN-PLACE UPDATE on balance column; no transaction audit log, balance history is lost',
      },
    };
  }
}
