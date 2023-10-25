import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { MS_WALLET } from '../../../common/constants/constants';
import {
  WALLET_SERVICE_NAME,
  walletDto,
  walletFilters,
  WalletServiceClient,
} from '@app/common/types/ms_wallet';

@Injectable()
export class WalletService {
  private readonly walletServiceClient: WalletServiceClient;
  constructor(@Inject(MS_WALLET) private client: ClientGrpc) {
    this.walletServiceClient =
      this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  /**
   * create new wallet
   * @param walletDto
   */
  createWallet(walletDto: walletDto) {
    return this.walletServiceClient.createWallet(walletDto);
  }

  /**
   * Find wallet
   * @param walletFilters
   */
  findWallet(walletFilters: walletFilters) {
    return this.walletServiceClient.findWallet(walletFilters);
  }
}
