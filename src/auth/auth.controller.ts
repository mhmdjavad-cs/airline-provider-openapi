import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SessionService } from './session/session.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
    description:
      'Returns the username and email of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user information.',
    schema: {
      example: {
        username: 'admin1',
        email: 'admin@example.com',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Not authenticated, invalid session, expired session, or user not found.',
  })
  async getMe(@Req() request: Request) {
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.sessionService.findSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    const user = await this.sessionService.findUser(session);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      username: user.username,
      email: user.email,
    };
  }
}
