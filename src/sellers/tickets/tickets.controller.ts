import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { TicketSellerGuard } from '../../auth/guards/ticket-seller.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@ApiTags('Sellers - Tickets')
@ApiCookieAuth('sessionId')
@Controller('sellers/tickets')
@UseGuards(TicketSellerGuard)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Purchase a ticket',
    description:
      'Purchases an available seat using the authenticated seller wallet.',
  })
  @ApiResponse({
    status: 201,
    description: 'Ticket purchased successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid flight, unavailable flight, invalid seat, or insufficient balance.',
  })
  @ApiResponse({
    status: 409,
    description: 'Seat is already sold.',
  })
  async create(
    @Req() request: Request,
    @Body() dto: CreateTicketDto,
  ) {
    const sellerId = (request as any).userId;

    return this.ticketsService.create(
      sellerId,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get seller tickets',
    description:
      'Returns all tickets belonging to the authenticated seller.',
  })
  @ApiResponse({
    status: 200,
    description: 'Seller tickets.',
  })
  async findAll(@Req() request: Request) {
    const sellerId = (request as any).userId;

    return this.ticketsService.findAll(
      sellerId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get ticket',
    description:
      'Returns a ticket belonging to the authenticated seller.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket details.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket not found.',
  })
  async findOne(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const sellerId = (request as any).userId;

    return this.ticketsService.findOne(
      sellerId,
      id,
    );
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel ticket',
    description:
      'Cancels the seller ticket and refunds its price to the seller wallet.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket cancelled successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Ticket is already cancelled.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket not found.',
  })
  async cancel(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const sellerId = (request as any).userId;

    return this.ticketsService.cancel(
      sellerId,
      id,
    );
  }
}
