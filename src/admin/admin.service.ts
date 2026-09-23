import { ConflictException, Injectable } from '@nestjs/common';
import {db} from "../db";
import { admins } from '../db/schema';
import { eq } from 'drizzle-orm';
import { SessionService } from '../auth/session/session.service';

@Injectable()
export class AdminService {

  constructor(private readonly sessionService: SessionService) {}


  async createAdmin(username: string,
                    email: string,
                    password: string) {

    const existingUsername = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username));
    if (existingUsername.length > 0) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));
    if (existingEmail.length > 0) {
      throw new ConflictException('Email already exists');
    }



    const result = await db
      .insert(admins)
      .values({
        username,
        email,
        passwordHash: password,
      })
      .returning();

    const admin = result[0];
    const session = await this.sessionService.createSession(admin.id, 'ADMIN');

    return {
      message: 'Admin account created successfully',
      sessionId: session.id,
    };

  }

}
