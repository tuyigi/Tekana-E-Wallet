import { Controller } from '@nestjs/common';
import {
  CreateWalletResponseDto,
  walletDto,
  walletFilters,
  walletOperationDto,
  WalletServiceController,
  WalletServiceControllerMethods,
} from '@app/common/types/ms_wallet';
import { Observable } from 'rxjs';
import { WalletService } from '../services/wallet.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
@WalletServiceControllerMethods()
export class WalletController implements WalletServiceController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * GRPC method for creating new wallet
   * @param request
   */

  @MessagePattern('createWallet')
  createWallet(
    request: walletDto,
  ):
    | Promise<CreateWalletResponseDto>
    | Observable<CreateWalletResponseDto>
    | CreateWalletResponseDto {
    return this.walletService.createWallet(request);
  }

  /**
   * GRPC method for findind wallet
   * @param request
   */

  @MessagePattern('findWallet')
  findWallet(
    request: walletFilters,
  ):
    | Promise<CreateWalletResponseDto>
    | Observable<CreateWalletResponseDto>
    | CreateWalletResponseDto {
    return this.walletService.findWallet(request);
  }

  /**
   * GRPC method for processing wallet operations before posting transactions
   * Operations: debit and credit
   * This method will be used only internal between MS transaction and MS wallet, it won't be exposed to public
   * @param request
   */

  @MessagePattern('processWalletOperation')
  processWalletOperation(
    request: walletOperationDto,
  ):
    | Promise<CreateWalletResponseDto>
    | Observable<CreateWalletResponseDto>
    | CreateWalletResponseDto {
    return this.walletService.processWalletOperation(request);
  }
}
