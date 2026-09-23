import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from '../../db';
import {
  flights,
  seats,
  tickets,
  wallets,
  walletTransactions,
} from '../../db/schema';

import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  async create(
    ticketSellerId: number,
    dto: CreateTicketDto,
  ) {
    return db.transaction((tx) => {
      // 1. Find the flight
      const flightResult = tx
        .select()
        .from(flights)
        .where(eq(flights.id, dto.flightId))
        .all();

      const flight = flightResult[0];

      if (!flight) {
        throw new NotFoundException('Flight not found');
      }

      if (flight.status !== 'SCHEDULED') {
        throw new BadRequestException(
          'Tickets can only be purchased for scheduled flights',
        );
      }

      // 2. Find the seat
      const seatResult = tx
        .select()
        .from(seats)
        .where(eq(seats.id, dto.seatId))
        .all();

      const seat = seatResult[0];

      if (!seat) {
        throw new NotFoundException('Seat not found');
      }

      // 3. Make sure the seat belongs to the airplane
      // assigned to this flight.
      if (seat.airplaneId !== flight.airplaneId) {
        throw new BadRequestException(
          'Seat does not belong to this flight',
        );
      }

      // 4. Make sure the seat isn't already sold
      const existingTicket = tx
        .select()
        .from(tickets)
        .where(
          and(
            eq(tickets.flightId, dto.flightId),
            eq(tickets.seatId, dto.seatId),
            eq(tickets.status, 'ACTIVE'),
          ),
        )
        .all();

      if (existingTicket.length > 0) {
        throw new ConflictException(
          'Seat is already sold',
        );
      }

      // 5. Find seller wallet
      const walletResult = tx
        .select()
        .from(wallets)
        .where(
          eq(
            wallets.ticketSellerId,
            ticketSellerId,
          ),
        )
        .all();

      const wallet = walletResult[0];

      if (!wallet) {
        throw new NotFoundException(
          'Wallet not found',
        );
      }

      if (wallet.status !== 'ACTIVE') {
        throw new BadRequestException(
          'Wallet is not active',
        );
      }

      // 6. Get price from the flight
      const price = flight.price;

      if (wallet.balance < price) {
        throw new BadRequestException(
          'Insufficient wallet balance',
        );
      }

      // 7. Create ticket
      const ticketResult = tx
        .insert(tickets)
        .values({
          flightId: dto.flightId,
          seatId: dto.seatId,
          ticketSellerId,
          passengerName: dto.passengerName,
          passengerPassportNumber:
            dto.passengerPassportNumber,
          price,
          status: 'ACTIVE',
        })
        .returning()
        .all();

      const ticket = ticketResult[0];

      // 8. Deduct money from wallet
      const balanceBefore = wallet.balance;
      const balanceAfter =
        balanceBefore - price;

      tx
        .update(wallets)
        .set({
          balance: balanceAfter,
          updatedAt: new Date(),
        })
        .where(eq(wallets.id, wallet.id))
        .run();

      // 9. Create wallet transaction
      tx
        .insert(walletTransactions)
        .values({
          walletId: wallet.id,
          type: 'TICKET_PURCHASE',
          amount: price,
          balanceBefore,
          balanceAfter,
          ticketId: ticket.id,
          description: `Ticket purchase for flight ${flight.flightNumber}`,
        })
        .run();

      return ticket;
    });
  }

  async findAll(ticketSellerId: number) {
    return db
      .select()
      .from(tickets)
      .where(
        eq(
          tickets.ticketSellerId,
          ticketSellerId,
        ),
      );
  }

  async findOne(
    ticketSellerId: number,
    id: number,
  ) {
    const result = await db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.id, id),
          eq(
            tickets.ticketSellerId,
            ticketSellerId,
          ),
        ),
      );

    if (!result[0]) {
      throw new NotFoundException(
        'Ticket not found',
      );
    }

    return result[0];
  }

  async cancel(
    ticketSellerId: number,
    id: number,
  ) {
    return db.transaction((tx) => {
      // 1. Find ticket belonging to this seller
      const ticketResult = tx
        .select()
        .from(tickets)
        .where(
          and(
            eq(tickets.id, id),
            eq(
              tickets.ticketSellerId,
              ticketSellerId,
            ),
          ),
        )
        .all();

      const ticket = ticketResult[0];

      if (!ticket) {
        throw new NotFoundException(
          'Ticket not found',
        );
      }

      if (ticket.status !== 'ACTIVE') {
        throw new BadRequestException(
          'Ticket is already cancelled',
        );
      }

      // 2. Find seller wallet
      const walletResult = tx
        .select()
        .from(wallets)
        .where(
          eq(
            wallets.ticketSellerId,
            ticketSellerId,
          ),
        )
        .all();

      const wallet = walletResult[0];

      if (!wallet) {
        throw new NotFoundException(
          'Wallet not found',
        );
      }

      // 3. Cancel ticket
      const ticketUpdate = tx
        .update(tickets)
        .set({
          status: 'CANCELLED',
          updatedAt: new Date(),
        })
        .where(eq(tickets.id, id))
        .returning()
        .all();

      // 4. Refund seller
      const balanceBefore = wallet.balance;
      const balanceAfter =
        balanceBefore + ticket.price;

      tx
        .update(wallets)
        .set({
          balance: balanceAfter,
          updatedAt: new Date(),
        })
        .where(eq(wallets.id, wallet.id))
        .run();

      // 5. Record refund
      tx
        .insert(walletTransactions)
        .values({
          walletId: wallet.id,
          type: 'REFUND',
          amount: ticket.price,
          balanceBefore,
          balanceAfter,
          ticketId: ticket.id,
          description: 'Ticket cancellation refund',
        })
        .run();

      return ticketUpdate[0];
    });
  }
}
