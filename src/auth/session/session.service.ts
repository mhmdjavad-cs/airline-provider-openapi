import { Injectable } from '@nestjs/common';
import { db } from '../../db';
import { admins, sessions, ticketSellers } from '../../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SessionService {
  async createSession(userId: number, userType: string) {
    const sessionId = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const result = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId,
        userType,
        expiresAt,
      })
      .returning();

    return result[0];
  }

  async findSession(sessionId: string) {
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    return result[0];
  }

  async findUser(session: { userId: number; userType: string }) {
    if (session.userType === 'ADMIN') {
      const result = await db
        .select()
        .from(admins)
        .where(eq(admins.id, session.userId));

      return result[0];
    }

    if (session.userType === 'TICKET_SELLER') {
      const result = await db
        .select()
        .from(ticketSellers)
        .where(eq(ticketSellers.id, session.userId));

      return result[0];
    }

    return undefined;
  }
}
