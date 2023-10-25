import { Module } from '@nestjs/common';
import { WalletTypeController } from './controllers/walletType.controller';
import { WalletTypeService } from './services/walletType.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletType } from './entities/walletType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletType])],
  controllers: [WalletTypeController],
  providers: [WalletTypeService],
})
export class WalletTypeModule {}
