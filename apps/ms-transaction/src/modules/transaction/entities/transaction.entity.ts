import {
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  BaseEntity,
  Index,
} from 'typeorm';
import { TransactionType } from '../../transaction_type/entities/transactionType.entity';
import { ChannelType, Status } from '@app/common/types/ms_transaction';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  public transaction_type_id: TransactionType;
  @Index()
  @Column()
  public reference_number: string;
  @Column('enum', {
    enum: ChannelType,
    default: ChannelType.WEB,
    nullable: false,
  })
  public channel_type: ChannelType;
  @Index()
  @Column()
  public external_reference_number: string;
  @Index()
  @Column()
  public debited_wallet_id: number;
  @Index()
  @Column()
  public credited_wallet_id: number;
  @Column()
  public debited_wallet_balance: number;
  @Column()
  public credited_wallet_balance: number;
  @Column()
  public amount: number;
  @Column('enum', {
    enum: Status,
    default: Status.PENDING,
  })
  public status: Status;
  @Column()
  public status_message: string;
  @Column()
  public created_at: Date;
  @Column()
  public updated_at: Date;
}
