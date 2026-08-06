import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('benchmark_ledger_transactions')
@Index('idx_ledger_account', ['accountId'])
export class LedgerTransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column()
  type: 'CREDIT' | 'DEBIT';

  @Column()
  previousHash: string;

  @Column()
  currentHash: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
