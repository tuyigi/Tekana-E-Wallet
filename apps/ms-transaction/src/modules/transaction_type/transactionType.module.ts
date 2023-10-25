import { TransactionTypeController } from './controllers/transactionType.controller';
import { TransactionTypeService } from './services/transactionType.service';
import { Module } from '@nestjs/common';
import { TransactionType } from './entities/transactionType.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransactionType } from './entities/walletTransactionType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionType, WalletTransactionType])],
  controllers: [TransactionTypeController],
  providers: [TransactionTypeService],
})
export class TransactionTypeModule {}
