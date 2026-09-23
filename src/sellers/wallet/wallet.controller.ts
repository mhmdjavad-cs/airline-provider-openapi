import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { TicketSellerGuard } from '../../auth/guards/ticket-seller.guard';
import { WalletService } from './wallet.service';

@ApiTags('Sellers - Wallet')
@ApiCookieAuth('sessionId')
@Controller('sellers/wallet')
@UseGuards(TicketSellerGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get seller wallet',
    description:
      'Returns the wallet of the authenticated ticket seller.',
  })
  @ApiResponse({
    status: 200,
    description: 'Seller wallet.',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found.',
  })
  async getWallet(@Req() request: Request) {
    const sellerId = (request as any).userId;

    return this.walletService.getWallet(
      sellerId,
    );
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Get wallet transactions',
    description:
      'Returns all wallet transactions of the authenticated ticket seller.',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet transactions.',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found.',
  })
  async getTransactions(
    @Req() request: Request,
  ) {
    const sellerId = (request as any).userId;

    return this.walletService.getTransactions(
      sellerId,
    );
  }
}
