import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminGuard } from '../../auth/guards/admin.guard';

import { TicketSellersService } from './ticket-sellers.service';
import { CreateTicketSellerDto } from './dto/create-ticket-seller.dto';
import { UpdateTicketSellerDto } from './dto/update-ticket-seller.dto';
import { DepositWalletDto } from './dto/deposit-wallet.dto';


@ApiTags('Admin - Ticket Sellers')
@ApiCookieAuth('sessionId')
@Controller('admin/ticket-sellers')
@UseGuards(AdminGuard)
export class TicketSellersController {
  constructor(private readonly ticketSellersService: TicketSellersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a ticket seller',
    description:
      'Creates a ticket seller and automatically creates an empty wallet.',
  })
  @ApiCreatedResponse({
    description: 'Ticket seller created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ticket seller data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  create(@Body() dto: CreateTicketSellerDto) {
    return this.ticketSellersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all ticket sellers',
  })
  @ApiResponse({
    status: 200,
    description: 'List of ticket sellers.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  findAll() {
    return this.ticketSellersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a ticket seller',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket seller found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket seller not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketSellersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a ticket seller',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket seller updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ticket seller data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket seller not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketSellerDto,
  ) {
    return this.ticketSellersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a ticket seller',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket seller deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket seller not found.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketSellersService.remove(id);
  }

  @Get(':id/wallet')
  @ApiOperation({
    summary: 'Get ticket seller wallet',
    description: 'Returns the wallet and current balance of a ticket seller.',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet information.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket seller or wallet not found.',
  })
  getWallet(@Param('id', ParseIntPipe) id: number) {
    return this.ticketSellersService.getWallet(id);
  }

  @Post(':id/wallet/deposit')
  @ApiOperation({
    summary: 'Deposit money into wallet',
    description:
      'Deposits money into a ticket seller wallet and creates a transaction record.',
  })
  @ApiCreatedResponse({
    description: 'Deposit successful.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid deposit amount.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket seller or wallet not found.',
  })
  deposit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DepositWalletDto,
  ) {
    return this.ticketSellersService.deposit(id, dto.amount);
  }

  @Get(':id/wallet/transactions')
  @ApiOperation({
    summary: 'Get wallet transactions',
    description: 'Returns all transactions for a ticket seller wallet.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of wallet transactions.',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated or session expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket seller or wallet not found.',
  })
  getWalletTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.ticketSellersService.getWalletTransactions(id);
  }
}
