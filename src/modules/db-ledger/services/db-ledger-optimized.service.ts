import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createHash } from 'crypto';
import { TransferTransactionDto } from '../dto/transfer-transaction.dto';
import { TamperLedgerDto } from '../dto/tamper-ledger.dto';
import { LedgerResponse, VerificationResult } from '../interfaces/db-ledger.interface';
import { LedgerTransactionEntity } from '../entities/ledger-transaction.entity';

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

@Injectable()
export class DbLedgerOptimizedService {
  constructor(private readonly dataSource: DataSource) {}

  private computeHash(previousHash: string, accountId: string, amount: number, type: string, createdAt: Date): string {
    const payload = `${previousHash}:${accountId}:${Number(amount).toFixed(2)}:${type}:${createdAt.toISOString()}`;
    return createHash('sha256').update(payload).digest('hex');
  }

  async transferOptimized(dto: TransferTransactionDto): Promise<LedgerResponse<LedgerTransactionEntity>> {
    const startMs = performance.now();
    const accountId = dto.accountId || 'ACC_1001';
    const amount = Number(dto.amount) || 100;
    const type = dto.type || 'CREDIT';
    const createdAt = new Date();

    // Fetch previous transaction entry for hash chaining
    const lastTx = await this.dataSource.query(
      `SELECT current_hash FROM benchmark_ledger_transactions ORDER BY id DESC LIMIT 1`,
    );

    const previousHash = lastTx.length > 0 ? lastTx[0].current_hash : GENESIS_HASH;
    const currentHash = this.computeHash(previousHash, accountId, amount, type, createdAt);

    const insertResult = await this.dataSource.query(
      `
      INSERT INTO benchmark_ledger_transactions (account_id, amount, type, previous_hash, current_hash, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, account_id AS "accountId", amount, type, previous_hash AS "previousHash", current_hash AS "currentHash", created_at AS "createdAt"
    `,
      [accountId, amount, type, previousHash, currentHash, createdAt],
    );

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      data: insertResult[0],
      performance: {
        executionTimeMs,
        strategy: 'IMMUTABLE_SHA256_APPEND_ONLY',
        description: 'Append-Only Ledger entry linked via cryptographic SHA-256 hash chaining',
      },
    };
  }

  async verifyIntegrity(): Promise<VerificationResult> {
    const startMs = performance.now();

    const transactions = await this.dataSource.query(
      `SELECT id, account_id AS "accountId", amount, type, previous_hash AS "previousHash", current_hash AS "currentHash", created_at AS "createdAt"
       FROM benchmark_ledger_transactions
       ORDER BY id ASC`,
    );

    const tamperedRecords: Array<{ id: number; accountId: string; expectedHash: string; actualHash: string }> = [];
    let expectedPrevHash = GENESIS_HASH;

    for (const tx of transactions) {
      const txCreatedAt = new Date(tx.createdAt);
      const computedHash = this.computeHash(expectedPrevHash, tx.accountId, Number(tx.amount), tx.type, txCreatedAt);

      if (computedHash !== tx.currentHash || tx.previousHash !== expectedPrevHash) {
        tamperedRecords.push({
          id: tx.id,
          accountId: tx.accountId,
          expectedHash: computedHash,
          actualHash: tx.currentHash,
        });
      }

      expectedPrevHash = tx.currentHash;
    }

    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      isValid: tamperedRecords.length === 0,
      totalRecordsScanned: transactions.length,
      tamperedRecords,
      performance: {
        executionTimeMs,
        strategy: 'CHAIN_INTEGRITY_VERIFICATION',
        description: 'Sequentially recalculated SHA-256 hash chain across all historical ledger rows',
      },
    };
  }

  async simulateTampering(dto: TamperLedgerDto): Promise<{ message: string; tamperedTransactionId: number }> {
    const txId = dto.transactionId || 1;
    const newAmount = dto.newAmount || 999999.99;

    // DIRECT DATABASE MUTATION TO SIMULATE FRAUD/TAMPERING
    await this.dataSource.query(
      `UPDATE benchmark_ledger_transactions SET amount = $1 WHERE id = $2`,
      [newAmount, txId],
    );

    return {
      message: `Simulated unauthorized DB tampering on transaction #${txId}. Run GET /verify to detect chain breakage!`,
      tamperedTransactionId: txId,
    };
  }

  async getTransactions(accountId?: string): Promise<LedgerTransactionEntity[]> {
    if (accountId) {
      return this.dataSource.query(
        `SELECT id, account_id AS "accountId", amount, type, previous_hash AS "previousHash", current_hash AS "currentHash", created_at AS "createdAt"
         FROM benchmark_ledger_transactions
         WHERE account_id = $1
         ORDER BY id ASC`,
        [accountId],
      );
    }

    return this.dataSource.query(
      `SELECT id, account_id AS "accountId", amount, type, previous_hash AS "previousHash", current_hash AS "currentHash", created_at AS "createdAt"
       FROM benchmark_ledger_transactions
       ORDER BY id ASC`,
    );
  }
}
