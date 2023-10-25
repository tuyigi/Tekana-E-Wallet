import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Wallet } from '../entities/wallet.entity';
import {
  CreateWalletResponse,
  CreateWalletResponseDto,
  walletDto,
  walletFilters,
  walletOperationDto,
} from '@app/common/types/ms_wallet';
import {
  CUSTOMER_SERVICE_NAME,
  CustomerFindResponseDto,
  CustomerServiceClient,
} from '@app/common/types/ms_customer';
import { MS_CUSTOMER } from '../../../../../api-gateway/src/common/constants/constants';
import { ClientGrpc } from '@nestjs/microservices';
import { WalletType } from '../../wallet_type/entities/walletType.entity';
import { walletProcessHandler } from '../../../common/helpers/utilities.helper';

@Injectable()
export class WalletService {
  /**
   * Inject MS customer in MS wallet
   */
  private customerService: CustomerServiceClient;
  constructor(@Inject(MS_CUSTOMER) private client: ClientGrpc) {
    this.customerService = this.client.getService<CustomerServiceClient>(
      CUSTOMER_SERVICE_NAME,
    );
  }

  /**
   * function for create wallet
   * @param walletDto
   */
  async createWallet(walletDto: walletDto): Promise<CreateWalletResponseDto> {
    /**
     * Check if customer exist in MS Customer
     * if exists create wallet of customer
     */
    const customer = this.customerService.findOne({
      id: walletDto.customerId,
    });
    let customerData: CustomerFindResponseDto;
    customer.subscribe(
      (customerFindResponseDto) => (customerData = customerFindResponseDto),
    );
    if (customerData.status !== HttpStatus.OK)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Customer wihth ${walletDto.customerId} ID not found`,
      };

    /**
     * Check if wallet type ID
     * exists in wallet types
     */
    const wallet_type = await WalletType.findOneBy({
      id: walletDto.walletTypeId,
    });
    if (!wallet_type)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `wallet type  with ${walletDto.customerId} ID not found`,
      };
    let wallet: Wallet;
    wallet.wallet_type_id = wallet_type;
    wallet.customer_id = walletDto.customerId;

    /**
     * Save custmer wallet
     */
    const savedWallet = await Wallet.save(wallet);

    return {
      status: HttpStatus.CREATED,
      message: 'Wallet created successfully ',
      data: {
        id: savedWallet.id,
        customerId: savedWallet.customer_id,
        currencyCode: savedWallet.currency_code,
        accountNumber: savedWallet.account_number,
        currentBalance: savedWallet.current_balance,
        status: savedWallet.status,
        walletTypeId: savedWallet.wallet_type_id.id,
      },
    };
  }

  /**
   *
   * Find wallet by account number, ID
   * @param walletFilters
   *
   */
  async findWallet(
    walletFilters: walletFilters,
  ): Promise<CreateWalletResponseDto> {
    /**
     * check if ID is valid
     */
    if (walletFilters.id === null || undefined)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `ID is not provided`,
      };
    /**
     * check if wallet with procided ID exists
     */
    const wallet: Wallet = await Wallet.findOneBy({ id: walletFilters.id });
    if (!wallet)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Wallet with ${walletFilters.id} not found`,
      };
    const data: CreateWalletResponse = {
      id: wallet.id,
      customerId: wallet.customer_id,
      currencyCode: wallet.currency_code,
      accountNumber: wallet.account_number,
      currentBalance: wallet.current_balance,
      status: wallet.status,
    };
    return {
      status: HttpStatus.OK,
      message: `Wallet found successfully`,
      data,
    };
  }

  /**
   * Process wallet operations before posting transactions
   * Operation: debit and credit
   * @param request
   */
  async processWalletOperation(
    request: walletOperationDto,
  ): Promise<CreateWalletResponseDto> {
    /**
     * Validate wallet
     */
    let wallet: Wallet = await Wallet.findOneBy({ id: request.walletId });
    if (!wallet)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Wallet with ${request.walletId} not found`,
      };
    /**
     * Process wallet operation by handler
     */
    wallet = await walletProcessHandler(wallet, request.amount, request.action);
    const data: CreateWalletResponse = {
      id: wallet.id,
      customerId: wallet.customer_id,
      currencyCode: wallet.currency_code,
      accountNumber: wallet.account_number,
      currentBalance: wallet.current_balance,
      status: wallet.status,
      walletTypeId: wallet.wallet_type_id.id,
    };
    return {
      status: HttpStatus.OK,
      message: `Wallet operation processed successfully`,
      data,
    };
  }
}
