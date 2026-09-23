import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FlightsService } from './flights.service';
import { TicketSellerGuard } from '../../auth/guards/ticket-seller.guard';


@ApiTags('Sellers - Flights')
@ApiCookieAuth('sessionId')
@Controller('sellers/flights')
@UseGuards(TicketSellerGuard)
export class FlightsController {
  constructor(
    private readonly flightsService: FlightsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Browse available flights',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    example: 'IKA',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    example: 'IST',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    example: '2026-10-01',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available flights.',
  })
  async findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('date') date?: string,
  ) {
    return this.flightsService.findAll(
      from,
      to,
      date,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get flight details',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Flight details.',
  })
  @ApiResponse({
    status: 404,
    description: 'Flight not found.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.flightsService.findOne(id);
  }

  @Get(':id/seats')
  @ApiOperation({
    summary: 'Browse flight seats',
    description:
      'Returns all seats for the flight and whether each seat is available for purchase.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Flight seats and availability.',
    schema: {
      example: [
        {
          id: 1,
          number: '1',
          available: true,
        },
        {
          id: 2,
          number: '2',
          available: false,
        },
        {
          id: 3,
          number: '3',
          available: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Flight not found.',
  })
  async findSeats(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.flightsService.findSeats(id);
  }
}
