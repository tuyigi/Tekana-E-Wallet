import { HttpStatus, Injectable } from '@nestjs/common';
import { FilterHelper } from '@app/common/helpers/filter.helper';
import { WalletType } from '../entities/walletType.entity';
import {
  CreateWalletTypeResponseDto,
  GetWalletsResponseDto,
  WalletTypeDto,
} from '@app/common/types/ms_wallet';

@Injectable()
export class WalletTypeService extends FilterHelper<WalletType> {
  /**
   * Create new wallet type
   * @param createWalletType
   */
  async createWalletType(
    createWalletType: WalletTypeDto,
  ): Promise<CreateWalletTypeResponseDto> {
    const createWalletTypeResponseDto: CreateWalletTypeResponseDto = null;

    /**
     * check if type code is not taken by other types
     */
    const walletType: WalletType = await WalletType.findOneBy({
      code: createWalletType.code,
    });
    if (walletType) {
      createWalletTypeResponseDto.message = `Code with ${createWalletType.code} already used`;
      createWalletTypeResponseDto.status = HttpStatus.CONFLICT;
      return createWalletTypeResponseDto;
    }

    /**
     * Save new type of wallet
     */
    walletType.code = createWalletType.code;
    walletType.minimum_transaction_amount =
      createWalletType.minimumTransactionAmount;
    walletType.maximum_transaction_amount =
      createWalletType.maximumTransactionAmount;
    walletType.name = createWalletType.name;
    const savedWalletType: WalletType = await WalletType.save(walletType);

    /**
     * Construct custom response
     */
    const walletDto: WalletTypeDto = {
      id: savedWalletType.id,
      name: savedWalletType.name,
      code: savedWalletType.code,
      description: savedWalletType.description,
      maximumTransactionAmount: savedWalletType.maximum_transaction_amount,
      minimumTransactionAmount: savedWalletType.minimum_transaction_amount,
    };
    const response: CreateWalletTypeResponseDto = {
      status: HttpStatus.CREATED,
      message: `Wallet type created successfully`,
      data: walletDto,
    };
    return response;
  }

  /**
   * Get wallet types and filter with any column
   * @param walletTypeDto
   */
  async getWalletTypes(
    walletTypeDto: WalletTypeDto,
  ): Promise<GetWalletsResponseDto> {
    const walletTypes = await this.paginate({});
    const data: WalletTypeDto[] = [];
    // walletTypes.list.map((value) => {
    //   data.push({
    //     name: value?.name,
    //     code: value?.code,
    //     description: value?.description,
    //     minimumTransactionAmount: value?.minimumTransactionAmount,
    //     maximumTransactionAmount: value?.maximumTransactionAmount,
    //     id: value?.id,
    //   });
    // });
    return {
      message: `success`,
      status: HttpStatus.OK,
      data,
    };
  }
}
