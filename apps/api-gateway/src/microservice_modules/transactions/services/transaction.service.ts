import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { MS_TRANSACTION } from '../../../common/constants/constants';
import {
  initiateTransactionDto,
  TRANSACTION_SERVICE_NAME,
  transactionFilterDto,
  TransactionServiceClient,
} from '@app/common/types/ms_transaction';

@Injectable()
export class TransactionService {
  private transactionClientService: TransactionServiceClient;
  constructor(@Inject(MS_TRANSACTION) private client: ClientGrpc) {
    this.transactionClientService =
      this.client.getService<TransactionServiceClient>(
        TRANSACTION_SERVICE_NAME,
      );
  }

  /**
   * Initiate new transaction
   * @param initiateTransactinDto
   */
  initiateTransaction(initiateTransactinDto: initiateTransactionDto) {
    return this.transactionClientService.initiateTransaction(
      initiateTransactinDto,
    );
  }

  /**
   * Filter transactions
   * @param transactionFilters
   */
  async getTransactions(transactionFilters: transactionFilterDto) {
    return this.transactionClientService.getTransactions(transactionFilters);
  }
}
