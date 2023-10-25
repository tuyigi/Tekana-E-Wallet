import { HttpStatus, Injectable } from '@nestjs/common';
import { TransactionType } from '../entities/transactionType.entity';
import {
  createTransactionTypeDto,
  createTransactionTypeResponseDto,
  transactionFilterResponseDto,
  transactionTypeFilters,
} from '@app/common/types/ms_transaction';
import { FilterHelper } from '@app/common/helpers/filter.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Any } from '../../../../../../google/protobuf/any';

@Injectable()
export class TransactionTypeService extends FilterHelper<TransactionType> {
  constructor(
    @InjectRepository(TransactionType)
    private transactionTypeRepo: Repository<TransactionType>,
  ) {
    super(transactionTypeRepo);
  }

  /**
   * Create Transaction Type
   * @param createTransactionTypeDto
   */
  async createTransactionType(
    createTransactionTypeDto: createTransactionTypeDto,
  ): Promise<createTransactionTypeResponseDto> {
    /**
     * Check if code is not taken by other transaction type
     */
    const transactionType: TransactionType = await TransactionType.findOneBy({
      code: createTransactionTypeDto.code,
    });
    if (transactionType)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `Transaction type with code ${createTransactionTypeDto.code} already exist`,
      };
    transactionType.code = createTransactionTypeDto.code;
    transactionType.name = createTransactionTypeDto.name;
    transactionType.description = createTransactionTypeDto.description;
    transactionType.minimum_amount = createTransactionTypeDto.minimumAmount;
    transactionType.maximum_amount = createTransactionTypeDto.maximumAmount;
    transactionType.status = createTransactionTypeDto.status;

    /**
     * Save transaction type
     */
    await TransactionType.save(transactionType);
    return {
      status: HttpStatus.CREATED,
      message: `Transaction type created successfully`,
    };
  }

  /**
   * Get Transction types
   * @param request
   */

  async getTransactionTypes(
    request: transactionTypeFilters,
  ): Promise<transactionFilterResponseDto> {
    const filters = {
      code: request.code || null,
      name: request.name || null,
    };
    const transactionTypes = await this.paginate({
      pageSize: 10,
      pageNumber: 1,
      filter: {
        ...filters,
      },
    });

    return {
      status: HttpStatus.OK,
      message: `success `,
      data: transactionTypes.list,
    };
  }
}
