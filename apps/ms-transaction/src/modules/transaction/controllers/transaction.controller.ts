import { Controller } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import {
  initiateTransactionResponseDto,
  transactionFilterResponseDto,
  TransactionServiceController,
  TransactionServiceControllerMethods,
  transactionFilterDto,
  initiateTransactionDto,
} from '@app/common/types/ms_transaction';
import { Observable } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
@TransactionServiceControllerMethods()
export class TransactionController implements TransactionServiceController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * GRPC method for filtering transaction
   * @param transactionFilterDto
   */
  @MessagePattern('getTransactions')
  getTransactions(
    transactionFilterDto: transactionFilterDto,
  ):
    | Promise<transactionFilterResponseDto>
    | Observable<transactionFilterResponseDto>
    | transactionFilterResponseDto {
    return this.transactionService.getTransactions(transactionFilterDto);
  }

  /**
   * Grpc for Initiating new transaction
   * @param initiateTransactionDto
   */
  @MessagePattern('initiateTransaction')
  initiateTransaction(
    initiateTransactionDto: initiateTransactionDto,
  ):
    | Promise<initiateTransactionResponseDto>
    | Observable<initiateTransactionResponseDto>
    | initiateTransactionResponseDto {
    return this.initiateTransaction(initiateTransactionDto);
  }
}
