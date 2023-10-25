import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MS_TRANSACTION_PACKAGE_NAME } from '@app/common/types/ms_transaction';
import { MS_TRANSACTION } from '../../common/constants/constants';
import { CustomerModule } from '../customers/customer.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_TRANSACTION,
        transport: Transport.GRPC,
        options: {
          package: MS_TRANSACTION_PACKAGE_NAME,
          protoPath: join(__dirname, '../ms_transaction.proto'),
        },
      },
    ]),
    CustomerModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
