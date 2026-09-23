import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an admin account',
    description:
      'Creates a new administrator account and starts a session for the new admin.',
  })
  @ApiCreatedResponse({
    description: 'Admin account created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data or weak password.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  async createAdmin(
    @Body() body: CreateAdminDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.adminService.createAdmin(
      body.username,
      body.email,
      body.password,
    );

    response.cookie('sessionId', result.sessionId, {
      httpOnly: true,
    });

    return {
      message: result.message,
    };
  }
}
