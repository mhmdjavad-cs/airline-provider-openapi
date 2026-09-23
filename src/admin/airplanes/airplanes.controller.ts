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

import { AirplanesService } from './airplanes.service';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';

@ApiTags('Admin - Airplanes')
@ApiCookieAuth('sessionId')
@Controller('admin/airplanes')
@UseGuards(AdminGuard)
export class AirplanesController {
  constructor(private readonly airplanesService: AirplanesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an airplane',
    description: 'Creates an airplane and automatically generates its seats.',
  })
  @ApiCreatedResponse({
    description: 'Airplane created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid airplane data.',
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
    description: 'Registration number already exists.',
  })
  create(@Body() dto: CreateAirplaneDto) {
    return this.airplanesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all airplanes',
    description: 'Returns all airplanes.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of airplanes.',
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
    return this.airplanesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an airplane',
    description: 'Returns an airplane by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Airplane found.',
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
    description: 'Airplane not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.airplanesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an airplane',
    description:
      'Updates an airplane. Capacity cannot be changed after creation.',
  })
  @ApiResponse({
    status: 200,
    description: 'Airplane updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid airplane data.',
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
    description: 'Airplane not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Registration number already exists.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAirplaneDto,
  ) {
    return this.airplanesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an airplane',
    description: 'Deletes an airplane by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Airplane deleted successfully.',
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
    description: 'Airplane not found.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.airplanesService.remove(id);
  }

  @Get(':id/flights')
  @ApiOperation({
    summary: 'Get airplane flights',
    description: 'Returns all flights assigned to an airplane.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of flights assigned to the airplane.',
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
    description: 'Airplane not found.',
  })
  findFlights(@Param('id', ParseIntPipe) id: number) {
    return this.airplanesService.findFlights(id);
  }
}
