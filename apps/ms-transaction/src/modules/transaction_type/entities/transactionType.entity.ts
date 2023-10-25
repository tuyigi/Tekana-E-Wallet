import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { TypeStatus } from '@app/common/types/ms_transaction';
import { WalletTransactionType } from './walletTransactionType.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class TransactionType extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Index()
  @Column({ unique: true, type: 'varchar', length: 100 })
  public code: string;
  @Index()
  @Column({ unique: true, type: 'varchar', length: 100 })
  public name: string;
  @Column()
  public description: string;
  @Column()
  public minimum_amount: number;
  @Column()
  public maximum_amount: number;
  @Column('enum', {
    enum: TypeStatus,
    default: TypeStatus.ACTIVE,
  })
  public status: TypeStatus;
  @OneToMany(
    () => WalletTransactionType,
    (walletTransaction) => walletTransaction.transaction_type_id,
  )
  public wallet_transaction_types: WalletTransactionType[];
  @OneToMany(
    () => Transaction,
    (transaction) => transaction.transaction_type_id,
  )
  public transactions: Transaction[];
  @CreateDateColumn()
  public created_at: Date;
  @UpdateDateColumn()
  public updated_at: Date;
}
