import { Exclude } from 'class-transformer';
import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { IdType, GenderType } from '@app/common/types/ms_customer';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 50 })
  public first_name: string;

  @Column({ type: 'varchar', length: 50 })
  public last_name: string;

  @Index()
  @Column({ type: 'varchar', unique: true, length: 100 })
  public email: string;
  @Index()
  @Column({ type: 'varchar', unique: true, length: 12 })
  public phone_number: string;

  @Column('enum', {
    name: 'id_type',
    nullable: false,
    enum: IdType,
    default: IdType.NID,
  })
  public id_type: IdType;
  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  public id_number: string;

  @Column('enum', {
    name: 'gender',
    enum: GenderType,
    nullable: false,
    default: GenderType.MALE,
  })
  public gender: GenderType;

  @Exclude()
  @Column({ type: 'varchar', length: 200 })
  public password: string;

  @Column()
  @CreateDateColumn()
  public created_at: Date;

  @Column()
  @UpdateDateColumn()
  public updated_at: Date;
}
