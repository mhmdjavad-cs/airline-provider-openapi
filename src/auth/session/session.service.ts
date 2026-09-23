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

  async findUserByUsername(username: string) {
    const adminResult = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username));

    if (adminResult[0]) {
      return {
        ...adminResult[0],
        userType: 'ADMIN',
      };
    }

    const sellerResult = await db
      .select()
      .from(ticketSellers)
      .where(eq(ticketSellers.username, username));

    if (sellerResult[0]) {
      return {
        ...sellerResult[0],
        userType: 'TICKET_SELLER',
      };
    }

    return undefined;
  }

  async deleteSession(sessionId: string) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

}
