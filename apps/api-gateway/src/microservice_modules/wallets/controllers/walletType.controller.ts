import {
  Controller,
  Post,
  Get,
  Res,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletTypeService } from '../services/walletType.service';
import { Request, Response } from 'express';
import { WalletTypeDto } from '@app/common/types/ms_wallet';
import { responseWrapperHelper } from '../../../common/helpers/responseWrapper.helper';
import { AuthGuard } from '../../../common/guards/authentication.guard';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Wallet Types')
@Controller('walletTypes')
export class WalletTypeController {
  constructor(private readonly walletTypeServise: WalletTypeService) {}

  /**
   * Create new Wallet Type
   * @method POST
   * @param response
   * @param walletTypeDto
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create new wallet type' })
  async createWalletType(
    @Res() response: Response,
    @Body() walletTypeDto: WalletTypeDto,
  ) {
    const createWalletType =
      this.walletTypeServise.createWalletType(walletTypeDto);
    return await responseWrapperHelper(response, createWalletType);
  }

  /**
   * Get Wallet Type
   * @method GET
   * @param response
   * @param request
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Wallet Types' })
  async getWalletTypes(@Res() response: Response, @Req() request: Request) {
    const id = Number(request.query.id);
    const walletTypeDto: WalletTypeDto = {
      code: null,
      name: null,
      description: null,
      maximumTransactionAmount: null,
      minimumTransactionAmount: null,
      id: Number(id),
    };
    const getWalletType = this.walletTypeServise.getWalletTypes(walletTypeDto);
    return await responseWrapperHelper(response, getWalletType);
  }
}
