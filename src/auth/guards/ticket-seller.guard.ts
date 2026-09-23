import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../session/session.service';

@Injectable()
export class TicketSellerGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<Request>();

    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session =
      await this.sessionService.findSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    if (session.userType !== 'TICKET_SELLER') {
      throw new ForbiddenException(
        'Ticket seller access required',
      );
    }

    (request as any).userId = session.userId;

    return true;
  }
}
