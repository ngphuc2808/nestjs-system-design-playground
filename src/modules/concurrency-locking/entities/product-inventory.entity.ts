import { Entity, PrimaryGeneratedColumn, Column, VersionColumn, UpdateDateColumn } from 'typeorm';

@Entity('benchmark_products')
export class ProductInventoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', default: 100 })
  stock: number;

  @VersionColumn()
  version: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
