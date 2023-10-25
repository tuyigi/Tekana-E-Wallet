import { Module } from '@nestjs/common';
import { WalletTypeController } from './controllers/walletType.controller';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { WalletTypeService } from './services/walletType.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_WALLET } from '../../common/constants/constants';
import { join } from 'path';
import { MS_WALLET_PACKAGE_NAME } from '@app/common/types/ms_wallet';
import { CustomerModule } from '../customers/customer.module';

@Module({
  imports: [
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
    CustomerModule,
  ],
  providers: [WalletTypeService, WalletService],
  controllers: [WalletTypeController, WalletController],
})
export class WalletModule {}
