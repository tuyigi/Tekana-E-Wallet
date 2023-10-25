import {
  WALLET_TYPE_SERVICE_NAME,
  WalletTypeDto,
  WalletTypeServiceClient,
} from '@app/common/types/ms_wallet';
import { Inject, Injectable } from '@nestjs/common';
import { MS_WALLET } from '../../../common/constants/constants';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class WalletTypeService {
  private readonly walletTypeServiceClient: WalletTypeServiceClient;

  constructor(@Inject(MS_WALLET) private client: ClientGrpc) {
    this.walletTypeServiceClient =
      this.client.getService<WalletTypeServiceClient>(WALLET_TYPE_SERVICE_NAME);
  }

  /**
   * Create New Wallet Type
   * @param walletTypeDto
   */
  createWalletType(walletTypeDto: WalletTypeDto) {
    return this.walletTypeServiceClient.createWalletType(walletTypeDto);
  }

  /**
   * Get wallet types
   * @param walletTypeDto
   */
  getWalletTypes(walletTypeDto: WalletTypeDto) {
    return this.walletTypeServiceClient.getWalletTypes(walletTypeDto);
  }
}
