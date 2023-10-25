import { Controller } from '@nestjs/common';
import {
  createTransactionTypeDto,
  createTransactionTypeResponseDto,
  transactionFilterResponseDto,
  transactionTypeFilters,
  TransactionTypeServiceController,
  TransactionTypeServiceControllerMethods,
} from '@app/common/types/ms_transaction';
import { Observable } from 'rxjs';
import { TransactionTypeService } from '../services/transactionType.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
@TransactionTypeServiceControllerMethods()
export class TransactionTypeController
  implements TransactionTypeServiceController
{
  constructor(readonly transactionTypeService: TransactionTypeService) {}

  /**
   * GRPC methopd for creating new transaction type
   * @param request
   */

  @MessagePattern('createTransactionType')
  createTransactionType(
    request: createTransactionTypeDto,
  ):
    | Promise<createTransactionTypeResponseDto>
    | Observable<createTransactionTypeResponseDto>
    | createTransactionTypeResponseDto {
    return this.transactionTypeService.createTransactionType(request);
  }

  /**
   * Get and Filter Transaction types
   * @param request
   */
  @MessagePattern('getTransactionTypes')
  getTransactionTypes(
    request: transactionTypeFilters,
  ):
    | Promise<transactionFilterResponseDto>
    | Observable<transactionFilterResponseDto>
    | transactionFilterResponseDto {
    return this.transactionTypeService.getTransactionTypes(request);
  }
}
