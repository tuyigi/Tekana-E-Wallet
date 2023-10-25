import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_CUSTOMER } from '../../../../api-gateway/src/common/constants/constants';
import { MS_CUSTOMER_PACKAGE_NAME } from '@app/common/types/ms_customer';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    ClientsModule.register([
      {
        name: MS_CUSTOMER,
        transport: Transport.GRPC,
        options: {
          package: MS_CUSTOMER_PACKAGE_NAME,
          protoPath: join(__dirname, '../ms_customer.proto'),
        },
      },
    ]),
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
