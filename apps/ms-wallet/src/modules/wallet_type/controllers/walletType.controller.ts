import { Controller } from '@nestjs/common';
import {
  CreateWalletTypeResponseDto,
  GetWalletsResponseDto,
  WalletTypeDto,
  WalletTypeServiceController,
  WalletTypeServiceControllerMethods,
} from '@app/common/types/ms_wallet';
import { WalletTypeService } from '../services/walletType.service';
import { Observable } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
@WalletTypeServiceControllerMethods()
export class WalletTypeController implements WalletTypeServiceController {
  constructor(private readonly walletTypeService: WalletTypeService) {}

  // grpc method for creating wallet type
  @MessagePattern('createWalletType')
  createWalletType(
    request: WalletTypeDto,
  ):
    | Promise<CreateWalletTypeResponseDto>
    | Observable<CreateWalletTypeResponseDto>
    | CreateWalletTypeResponseDto {
    return this.walletTypeService.createWalletType(request);
  }

  // grpc method for retrieving and filtering wallet typea
  @MessagePattern('getWalletTypes')
  getWalletTypes(
    request: WalletTypeDto,
  ):
    | Promise<GetWalletsResponseDto>
    | Observable<GetWalletsResponseDto>
    | GetWalletsResponseDto {
    return this.walletTypeService.getWalletTypes(request);
  }
}
