import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SessionService } from './session/session.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}


  @Get('me')
  @ApiCookieAuth('sessionId')
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



  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Authenticates an admin or ticket seller and creates a new session.',
  })
  @ApiCreatedResponse({
    description: 'Login successful. A sessionId cookie is set.',
    schema: {
      example: {
        message: 'Login successful',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid username or password.',
  })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.sessionService.findUserByUsername(body.username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.passwordHash !== body.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const session = await this.sessionService.createSession(
      user.id,
      user.userType,
    );

    response.cookie('sessionId', session.id, {
      httpOnly: true,
    });

    return {
      message: 'Login successful',
    };
  }



  @Post('logout')
  @ApiCookieAuth('sessionId')
  @ApiOperation({
    summary: 'Logout',
    description: 'Deletes the current session and clears the sessionId cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful.',
    schema: {
      example: {
        message: 'Logout successful',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No active session was found.',
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.sessionService.deleteSession(sessionId);

    response.clearCookie('sessionId');

    return {
      message: 'Logout successful',
    };
  }



}
