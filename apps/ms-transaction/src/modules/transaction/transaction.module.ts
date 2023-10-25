import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionHandlerService } from './services/transactionHandler.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_WALLET } from '../../../../api-gateway/src/common/constants/constants';
import { join } from 'path';
import { MS_WALLET_PACKAGE_NAME } from '@app/common/types/ms_wallet';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: MS_WALLET,
        transport: Transport.GRPC,
        options: {
          package: MS_WALLET_PACKAGE_NAME,
          protoPath: join(__dirname, '../ms_wallet.proto'),
        },
      },
    ]),
  ],
  providers: [TransactionService, TransactionHandlerService],
  controllers: [TransactionController],
})
export class TransactionModule {}
