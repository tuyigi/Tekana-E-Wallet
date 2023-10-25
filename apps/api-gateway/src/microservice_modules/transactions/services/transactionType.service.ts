import { Inject, Injectable } from '@nestjs/common';
import { MS_TRANSACTION } from '../../../common/constants/constants';
import { ClientGrpc } from '@nestjs/microservices';
import { createTransactionTypeDto } from '@app/common/types/ms_transaction';
import {
  MS_TRANSACTION_PACKAGE_NAME,
  TransactionTypeServiceClient,
} from '@app/common/types/ms_transaction';

@Injectable()
export class TransactionTypeService {
  private readonly transactionTypeServiceClient: TransactionTypeServiceClient;
  constructor(@Inject(MS_TRANSACTION) private readonly client: ClientGrpc) {
    this.transactionTypeServiceClient =
      this.client.getService<TransactionTypeServiceClient>(
        MS_TRANSACTION_PACKAGE_NAME,
      );
  }

  /**
   * Create new Transaction Type
   * @param createTransactionTypeDto
   */
  createTransactionType(createTransactionTypeDto: createTransactionTypeDto) {
    return this.transactionTypeServiceClient.createTransactionType(
      createTransactionTypeDto,
    );
  }
}
