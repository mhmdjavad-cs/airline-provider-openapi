import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from './session/session.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('me')
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
