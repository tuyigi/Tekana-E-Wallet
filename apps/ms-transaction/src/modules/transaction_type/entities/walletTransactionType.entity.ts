import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from './transactionType.entity';

@Entity()
export class WalletTransactionType extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column()
  public wallet_type_id: number;
  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.wallet_transaction_types,
  )
  public transaction_type_id: TransactionType;
  @Column()
  public debit_allowed: boolean;
  @Column()
  public credit_allowed: boolean;
  @CreateDateColumn()
  public created_at: Date;
  @UpdateDateColumn()
  public updated_at: Date;
}
