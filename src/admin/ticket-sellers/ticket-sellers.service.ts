import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import { db } from '../../db';
import { ticketSellers, wallets, walletTransactions } from '../../db/schema';

import { CreateTicketSellerDto } from './dto/create-ticket-seller.dto';
import { UpdateTicketSellerDto } from './dto/update-ticket-seller.dto';



@Injectable()
export class TicketSellersService {
  async create(dto: CreateTicketSellerDto) {
    const existingUsername = await db
      .select()
      .from(ticketSellers)
      .where(eq(ticketSellers.username, dto.username));

    if (existingUsername.length > 0) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await db
      .select()
      .from(ticketSellers)
      .where(eq(ticketSellers.email, dto.email));

    if (existingEmail.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const result = await db
      .insert(ticketSellers)
      .values({
        name: dto.name,
        username: dto.username,
        email: dto.email,
        passwordHash: dto.password,
        status: dto.status,
      })
      .returning();

    const seller = result[0];

    // Every ticket seller gets exactly one wallet.
    await db.insert(wallets).values({
      ticketSellerId: seller.id,
      balance: 0,
      status: 'ACTIVE',
    });

    return seller;
  }

  async findAll() {
    return db.select().from(ticketSellers);
  }

  async findOne(id: number) {
    const result = await db
      .select()
      .from(ticketSellers)
      .where(eq(ticketSellers.id, id));

    if (!result[0]) {
      throw new NotFoundException('Ticket seller not found');
    }

    return result[0];
  }

  async update(id: number, dto: UpdateTicketSellerDto) {
    await this.findOne(id);

    if (dto.username) {
      const existing = await db
        .select()
        .from(ticketSellers)
        .where(eq(ticketSellers.username, dto.username));

      if (existing.length > 0 && existing[0].id !== id) {
        throw new ConflictException('Username already exists');
      }
    }

    if (dto.email) {
      const existing = await db
        .select()
        .from(ticketSellers)
        .where(eq(ticketSellers.email, dto.email));

      if (existing.length > 0 && existing[0].id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const result = await db
      .update(ticketSellers)
      .set({
        ...(dto.name !== undefined && {
          name: dto.name,
        }),
        ...(dto.username !== undefined && {
          username: dto.username,
        }),
        ...(dto.email !== undefined && {
          email: dto.email,
        }),
        ...(dto.password !== undefined && {
          passwordHash: dto.password,
        }),
        ...(dto.status !== undefined && {
          status: dto.status,
        }),
        updatedAt: new Date(),
      })
      .where(eq(ticketSellers.id, id))
      .returning();

    return result[0];
  }

  async remove(id: number) {
    await this.findOne(id);

    await db.delete(ticketSellers).where(eq(ticketSellers.id, id));

    return {
      message: 'Ticket seller deleted successfully',
    };
  }

  async getWallet(ticketSellerId: number) {
    await this.findOne(ticketSellerId);

    const result = await db
      .select()
      .from(wallets)
      .where(eq(wallets.ticketSellerId, ticketSellerId));

    if (!result[0]) {
      throw new NotFoundException('Wallet not found');
    }

    return result[0];
  }

  async deposit(ticketSellerId: number, amount: number, description?: string) {
    await this.findOne(ticketSellerId);

    const walletResult = await db
      .select()
      .from(wallets)
      .where(eq(wallets.ticketSellerId, ticketSellerId));

    const wallet = walletResult[0];

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    const result = await db
      .update(wallets)
      .set({
        balance: balanceAfter,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id))
      .returning();

    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      type: 'DEPOSIT',
      amount,
      balanceBefore,
      balanceAfter,
      description: description ?? 'Wallet deposit',
    });

    return result[0];
  }

  async getWalletTransactions(ticketSellerId: number) {
    await this.findOne(ticketSellerId);

    const walletResult = await db
      .select()
      .from(wallets)
      .where(eq(wallets.ticketSellerId, ticketSellerId));

    const wallet = walletResult[0];

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.walletId, wallet.id));
  }
}
