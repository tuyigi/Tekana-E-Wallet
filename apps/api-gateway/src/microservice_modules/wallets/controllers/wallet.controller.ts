import {
  Controller,
  Post,
  Get,
  Res,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { Response, Request } from 'express';
import { walletDto } from '@app/common/types/ms_wallet';
import { responseWrapperHelper } from '../../../common/helpers/responseWrapper.helper';
import { AuthGuard } from '../../../common/guards/authentication.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Wallets')
@ApiBearerAuth()
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Create new wallet
   * wallet must belong to a specific customer
   * @method POST
   * @param request
   * @param response
   * @param walletDto
   */

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create new wallet' })
  async createWallet(
    @Req() request: Request,
    @Res() response: Response,
    @Body() walletDto: walletDto,
  ) {
    const createWallet = this.walletService.createWallet(walletDto);
    return await responseWrapperHelper(response, createWallet);
  }

  /**
   * Find wallet by ID
   * @method GET
   * @param response
   * @param request
   */

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find Wallet' })
  async findWallet(@Res() response: Response, @Req() request: Request) {
    const { id } = request.query;
    const walletFilters = { id: Number(id) };
    const findWallet = this.walletService.findWallet(walletFilters);
    return await responseWrapperHelper(response, findWallet);
  }
}
