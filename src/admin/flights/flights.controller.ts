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

import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@ApiTags('Admin - Flights')
@ApiCookieAuth('sessionId')
@Controller('admin/flights')
@UseGuards(AdminGuard)
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a flight',
    description: 'Creates a new flight.',
  })
  @ApiCreatedResponse({
    description: 'Flight created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid flight data.',
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
    description: 'Airport or airplane not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Flight number already exists or invalid flight schedule.',
  })
  create(@Body() dto: CreateFlightDto) {
    return this.flightsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all flights',
  })
  @ApiResponse({
    status: 200,
    description: 'List of flights.',
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
    return this.flightsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a flight',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight found.',
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
    description: 'Flight not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a flight',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid flight data.',
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
    description: 'Flight, airport, or airplane not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Flight number already exists or invalid flight schedule.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFlightDto) {
    return this.flightsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a flight',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight deleted successfully.',
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
    description: 'Flight not found.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.remove(id);
  }

  @Get(':id/seats')
  @ApiOperation({
    summary: 'Get flight seats',
    description:
      'Returns all seats belonging to the assigned airplane and their current availability.',
  })
  @ApiResponse({
    status: 200,
    description: 'Flight seats with availability.',
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
    description: 'Flight not found.',
  })
  findSeats(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.findSeats(id);
  }

  @Get(':id/tickets')
  @ApiOperation({
    summary: 'Get flight tickets',
    description:
      'Returns all tickets for the flight, including cancelled tickets.',
  })
  @ApiResponse({
    status: 200,
    description: 'All tickets for the flight, including cancelled tickets.',
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
    description: 'Flight not found.',
  })
  findTickets(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.findTickets(id);
  }
}
