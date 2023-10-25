import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  initiateTransactionDto,
  transactionFilterDto,
} from '@app/common/types/ms_transaction';
import { TransactionService } from '../services/transaction.service';
import { responseWrapperHelper } from '../../../common/helpers/responseWrapper.helper';
import { AuthGuard } from '../../../common/guards/authentication.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Initiate new transaction request
   * @method POST
   * @param response
   * @param initiateTransactionDto
   */

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Initiate new transaction request' })
  public async initiateTransaction(
    @Res() response: Response,
    @Body() initiateTransactionDto: initiateTransactionDto,
  ) {
    const postTransaction = this.transactionService.initiateTransaction(
      initiateTransactionDto,
    );
    return await responseWrapperHelper(response, postTransaction);
  }

  /**
   * Get and filter Transactions
   * @method GET
   * @param response
   * @param params
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get transactions by filtering' })
  public async getTransactions(
    @Res() response: Response,
    @Query() params: transactionFilterDto,
  ) {
    const filterTransactions = await this.transactionService.getTransactions(
      params,
    );
    return await responseWrapperHelper(response, filterTransactions);
  }
}
