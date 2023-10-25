import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  Index,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class WalletType extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column({ type: 'varchar', length: 50 })
  public name: string;
  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  public code: string;
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public maximum_transaction_amount: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public minimum_transaction_amount: number;
  @Column({ type: 'varchar', length: 50 })
  public description: string;
  @OneToMany(() => Wallet, (wallet) => wallet.wallet_type_id)
  public wallets: Wallet[];
  @CreateDateColumn()
  public created_at: Date;
  @UpdateDateColumn()
  public updated_at: Date;
}
