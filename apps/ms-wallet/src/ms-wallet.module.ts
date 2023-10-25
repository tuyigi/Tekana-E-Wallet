import { Module } from '@nestjs/common';
import { WalletModule } from './modules/wallet/wallet.module';
import { WalletTypeModule } from './modules/wallet_type/walletType.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './modules/wallet/entities/wallet.entity';
import { WalletType } from './modules/wallet_type/entities/walletType.entity';
import { WalletSubscriber } from './common/subscribers/wallet.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST_MS_WALLET,
      port: parseInt(process.env.DB_PORT_MS_WALLET),
      database: process.env.DB_NAME_MS_WALLET,
      username: process.env.DB_USER_MS_WALLET,
      password: process.env.DB_PASSWORD_MS_WALLET,
      entities: [Wallet, WalletType],
      subscribers: [WalletSubscriber],
      synchronize: true,
      logging: true,
    }),
    WalletModule,
    WalletTypeModule,
  ],
})
export class MsWalletModule {}
