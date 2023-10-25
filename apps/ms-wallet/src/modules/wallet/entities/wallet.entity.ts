import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Index,
} from 'typeorm';
import { WalletStatus, CurrencyCode } from '@app/common/types/ms_wallet';
import { WalletType } from '../../wallet_type/entities/walletType.entity';

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Index()
  @Column()
  public customer_id: number;
  @Column('enum', {
    enum: CurrencyCode,
    default: CurrencyCode.RWF,
    nullable: false,
  })
  public currency_code: CurrencyCode;
  @Index()
  @Column({ unique: true })
  public account_number: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  public current_balance: number;
  @ManyToOne(() => WalletType, (wallet_type_id) => wallet_type_id.wallets)
  public wallet_type_id: WalletType;
  @Column('enum', {
    enum: WalletStatus,
    default: WalletStatus.ACTIVE,
    nullable: false,
  })
  public status: WalletStatus;
  @CreateDateColumn()
  public created_at: Date;
  @UpdateDateColumn()
  public updated_at: Date;
}
