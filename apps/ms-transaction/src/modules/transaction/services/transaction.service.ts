import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import {
  initiateTransactionDto,
  initiateTransactionResponseDto,
  transactionFilterDto,
  transactionFilterResponseDto,
} from '@app/common/types/ms_transaction';
import { TransactionHandlerService } from './transactionHandler.service';
import { TransactionProccessDto } from '../../../common/dtos/transactionProccessDto.dto';
import { FilterHelper } from '@app/common/helpers/filter.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { walletOperationDto } from '@app/common/types/ms_wallet';

@Injectable()
export class TransactionService extends FilterHelper<Transaction> {
  @Inject()
  private transactionHandler: TransactionHandlerService;
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {
    super(repo);
  }

  /**
   * -- Initiate new transaction to be processed --
   * @param initiateTransactinDto
   */
  async initiateTransaction(
    initiateTransactinDto: initiateTransactionDto,
  ): Promise<initiateTransactionResponseDto> {
    /**
     * check if external reference already exist
     */
    const transaction: Transaction = await Transaction.findOneBy({
      external_reference_number: initiateTransactinDto.externalReferenceNumber,
    });
    if (transaction)
      return {
        status: HttpStatus.CONFLICT,
        message: `Transaction already exist with ${initiateTransactinDto.externalReferenceNumber}`,
      };

    /**
     * Send details to transaction handler for processing
     */
    const transactionProccessDto: TransactionProccessDto =
      await this.transactionHandler.process(initiateTransactinDto);
    if (transactionProccessDto.isProccessed === false)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `${transactionProccessDto.message}`,
      };

    /**
     * respond success response
     */
    return {
      status: HttpStatus.OK,
      message: `${transactionProccessDto.message}`,
      data: initiateTransactinDto,
    };
  }

  /**
   * -- Retrieve customers --
   * @param transactionFilters
   */

  async getTransactions(
    transactionFilters: transactionFilterDto,
  ): Promise<transactionFilterResponseDto> {
    const filters = {
      transact_type_id: transactionFilters.transactionTypeId || null,
      credited_wallet_id: transactionFilters.creditedWalletId || null,
      debited_wallet_id: transactionFilters.debitedWalletId || null,
      channel_type: transactionFilters.channelType || null,
      reference_number: transactionFilters.referenceNumber || null,
      external_reference_number:
        transactionFilters.externalReferenceNumber || null,
    };

    /**
     * Filter in transactions
     */

    const transactions = await this.paginate({
      pageSize: 10,
      pageNumber: 1,
      filter: {
        ...filters,
      },
    });

    return { status: HttpStatus.OK, message: 'success', data: transactions };
  }
}
