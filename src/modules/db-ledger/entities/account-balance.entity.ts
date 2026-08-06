import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('benchmark_ledger_accounts')
export class AccountBalanceEntity {
  @PrimaryColumn()
  accountId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 1000.0 })
  balance: number;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
