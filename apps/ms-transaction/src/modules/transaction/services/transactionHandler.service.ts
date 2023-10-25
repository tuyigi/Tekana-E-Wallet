import { Inject, Injectable } from '@nestjs/common';
import {
  ChannelType,
  initiateTransactionDto,
  Status,
} from '@app/common/types/ms_transaction';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateWalletResponseDto,
  enumWalletOperation,
  WALLET_SERVICE_NAME,
  walletOperationDto,
  WalletServiceClient,
  WalletStatus,
} from '@app/common/types/ms_wallet';
import { MS_WALLET_PACKAGE_NAME } from '@app/common/types/ms_wallet';
import { TransactionProccessDto } from '../../../common/dtos/transactionProccessDto.dto';
import { WalletTransactionType } from '../../transaction_type/entities/walletTransactionType.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../../transaction_type/entities/transactionType.entity';
import { generateReferenceNumber } from '@app/common/helpers/utils.helper';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TransactionHandlerService {
  /**
   * Injected Wallet service in out handler
   * @private
   */

  private walletServiceClient: WalletServiceClient;
  constructor(@Inject(MS_WALLET_PACKAGE_NAME) private client: ClientGrpc) {
    this.walletServiceClient =
      this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  /**
   * Process transaction
   * @param initiateTransactionDto
   */
  async process(
    initiateTransactionDto: initiateTransactionDto,
  ): Promise<TransactionProccessDto> {
    try {
      /**
       * Check transaction type
       */
      const transactionType = await TransactionType.findOneBy({
        id: initiateTransactionDto.transactionTypeId,
      });
      if (!transactionType)
        return {
          isProccessed: false,
          message: `Transaction type with ${initiateTransactionDto.transactionTypeId} ID not found`,
        };

      /**
       * validate debitor wallets from MS Wallet
       */
      const debited_wallet = this.walletServiceClient.findWallet({
        id: initiateTransactionDto.debitedWalletId,
      });

      let debitedWalletData: CreateWalletResponseDto;
      debited_wallet.subscribe(
        (customerFindResponseDto) =>
          (debitedWalletData = customerFindResponseDto),
      );
      if (debitedWalletData.status !== 200)
        return {
          isProccessed: false,
          message: `Wallet with ${initiateTransactionDto.debitedWalletId} ID not found `,
        };

      /**
       * validate creditor wallets from MS Wallet
       */

      const credited_wallet = this.walletServiceClient.findWallet({
        id: initiateTransactionDto.debitedWalletId,
      });

      let creditedWalletData: CreateWalletResponseDto;
      credited_wallet.subscribe(
        (customerFindResponseDto) =>
          (creditedWalletData = customerFindResponseDto),
      );
      if (creditedWalletData.status !== 200)
        return {
          isProccessed: false,
          message: `Wallet with ${initiateTransactionDto.creditedWalletId} ID not found `,
        };

      /**
       * check transaction rules --
       * if debitor is allowed to be debited on certain transaction type
       */

      const conditions: FindOptionsWhere<TransactionType> = {
        id: initiateTransactionDto.transactionTypeId,
      };

      const debitTransactionRule: WalletTransactionType =
        await WalletTransactionType.findOneBy({
          transaction_type_id: conditions,
          debit_allowed: true,
          wallet_type_id: debitedWalletData.data.walletTypeId,
        });

      if (!debitTransactionRule)
        return {
          isProccessed: false,
          message: `Wallet with ${debitedWalletData.data.accountNumber} is not allowed to be debited on this transaction type`,
        };

      /**
       * check transaction rules --
       * if creditor is allowed to be credited on certain transaction type
       */

      const creditTransactionRule: WalletTransactionType =
        await WalletTransactionType.findOneBy({
          transaction_type_id: conditions,
          debit_allowed: true,
          wallet_type_id: creditedWalletData.data.walletTypeId,
        });

      if (!creditTransactionRule)
        return {
          isProccessed: false,
          message: `Wallet with ${creditedWalletData.data.accountNumber} is not allowed to be credited on this transaction type`,
        };

      /**
       * Check if debitor has suffcient balance
       */
      if (initiateTransactionDto.amount > debitedWalletData.data.currentBalance)
        return {
          isProccessed: false,
          message: `Insufficient funds`,
        };

      /**
       * Check if both wallets are active
       */
      if (
        debitedWalletData.data.status !== WalletStatus.ACTIVE ||
        creditedWalletData.data.status !== WalletStatus.ACTIVE
      )
        return {
          isProccessed: false,
          message: `One of wallets is not active`,
        };

      /**
       * process wallet operations  : debit
       */
      const walletDebitOperationDto: walletOperationDto = {
        action: enumWalletOperation.WITHDRAW,
        amount: initiateTransactionDto.amount,
        walletId: initiateTransactionDto.debitedWalletId,
      };

      let credidResponseDto: CreateWalletResponseDto;
      this.walletServiceClient
        .processWalletOperation(walletDebitOperationDto)
        .subscribe((v) => (credidResponseDto = v));

      if (credidResponseDto.status !== 200)
        return { isProccessed: false, message: `${credidResponseDto.message}` };

      /**
       * process wallet operations  : debit
       */

      const walletCreditOperationDto: walletOperationDto = {
        action: enumWalletOperation.WITHDRAW,
        amount: initiateTransactionDto.amount,
        walletId: initiateTransactionDto.debitedWalletId,
      };
      let debitResponseDto: CreateWalletResponseDto;
      this.walletServiceClient
        .processWalletOperation(walletCreditOperationDto)
        .subscribe((v) => (debitResponseDto = v));

      if (debitResponseDto.status !== 200)
        return { isProccessed: false, message: `${debitResponseDto.message}` };

      /**
       * Post transaction
       */

      const reference_number: string = generateReferenceNumber();
      let transaction: Transaction;

      transaction.amount = initiateTransactionDto.amount;
      transaction.credited_wallet_id = initiateTransactionDto.creditedWalletId;
      transaction.debited_wallet_id = initiateTransactionDto.debitedWalletId;
      transaction.external_reference_number =
        initiateTransactionDto.externalReferenceNumber;
      transaction.status = Status.COMPLETED;
      transaction.channel_type = ChannelType.WEB;
      transaction.transaction_type_id = transactionType;
      transaction.reference_number = reference_number;
      const savedTransaction: Transaction = await Transaction.save(transaction);
      return {
        isProccessed: true,
        message: `Transaction posted successfully!`,
        transaction: savedTransaction,
      };
    } catch (e) {
      return {
        isProccessed: false,
        message: `${e.message}`,
      };
    }
  }
}
