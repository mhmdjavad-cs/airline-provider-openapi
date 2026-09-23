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
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';

@ApiTags('Admin - Airports')
@ApiCookieAuth('sessionId')
@Controller('admin/airports')
@UseGuards(AdminGuard)
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an airport',
    description: 'Creates a new airport. Requires admin authentication.',
  })
  @ApiCreatedResponse({
    description: 'Airport created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid airport data.',
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
    description: 'Airport code already exists.',
  })
  create(@Body() dto: CreateAirportDto) {
    return this.airportsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all airports',
    description: 'Returns all airports. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of airports.',
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
    return this.airportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an airport',
    description: 'Returns an airport by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Airport found.',
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
    description: 'Airport not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.airportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an airport',
    description: 'Updates an existing airport.',
  })
  @ApiResponse({
    status: 200,
    description: 'Airport updated successfully.',
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
    description: 'Airport not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Airport code already exists.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateAirportDto>,
  ) {
    return this.airportsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an airport',
    description: 'Deletes an airport by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Airport deleted successfully.',
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
    description: 'Airport not found.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.airportsService.remove(id);
  }
}