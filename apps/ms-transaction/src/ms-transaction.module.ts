import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionTypeModule } from './modules/transaction_type/transactionType.module';
import { TransactionType } from './modules/transaction_type/entities/transactionType.entity';
import { WalletTransactionType } from './modules/transaction_type/entities/walletTransactionType.entity';
import { TransactionModule } from './modules/transaction/transaction.module';
import { Transaction } from './modules/transaction/entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST_MS_TRANSACTION,
      port: parseInt(process.env.DB_PORT_MS_TRANSACTION),
      database: process.env.DB_NAME_MS_TRANSACTION,
      username: process.env.DB_USER_MS_TRANSACTION,
      password: process.env.DB_PASSWORD_MS_TRANSACTION,
      entities: [TransactionType, WalletTransactionType, Transaction],
      synchronize: true,
      logging: true,
    }),
    TransactionTypeModule,
    TransactionModule,
  ],
})
export class MsTransactionModule {}
