import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, gte, lt } from 'drizzle-orm';

import { db } from '../../db';
import { airports, flights, seats, tickets } from '../../db/schema';

@Injectable()
export class FlightsService {
  async findAll(from?: string, to?: string, date?: string) {
    const conditions = [eq(flights.status, 'SCHEDULED')];

    if (from) {
      conditions.push(eq(airports.code, from));
    }

    if (to) {
      conditions.push(eq(airports.code, to));
    }

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T00:00:00.000Z`);
      end.setUTCDate(end.getUTCDate() + 1);

      conditions.push(
        gte(flights.departureTime, start),
        lt(flights.departureTime, end),
      );
    }

    return db
      .select({
        id: flights.id,
        flightNumber: flights.flightNumber,
        departureAirport: {
          id: airports.id,
          name: airports.name,
          code: airports.code,
          city: airports.city,
          country: airports.country,
        },
        departureTime: flights.departureTime,
        arrivalTime: flights.arrivalTime,
        status: flights.status,
      })
      .from(flights)
      .innerJoin(airports, eq(flights.departureAirportId, airports.id))
      .where(and(...conditions));
  }

  async findOne(id: number) {
    const result = await db
      .select({
        id: flights.id,
        flightNumber: flights.flightNumber,
        airplaneId: flights.airplaneId,
        departureAirport: {
          id: airports.id,
          name: airports.name,
          code: airports.code,
          city: airports.city,
          country: airports.country,
        },
        departureTime: flights.departureTime,
        arrivalTime: flights.arrivalTime,
        status: flights.status,
      })
      .from(flights)
      .innerJoin(airports, eq(flights.departureAirportId, airports.id))
      .where(and(eq(flights.id, id), eq(flights.status, 'SCHEDULED')));

    if (!result[0]) {
      throw new NotFoundException('Flight not found');
    }

    return result[0];
  }

  async findSeats(id: number) {
    const flight = await this.findOne(id);

    const flightSeats = await db
      .select()
      .from(seats)
      .where(eq(seats.airplaneId, flight.airplaneId));

    const flightTickets = await db
      .select()
      .from(tickets)
      .where(eq(tickets.flightId, id));

    const activeSeatIds = new Set(
      flightTickets
        .filter((ticket) => ticket.status === 'ACTIVE')
        .map((ticket) => ticket.seatId),
    );

    return flightSeats.map((seat) => ({
      id: seat.id,
      number: seat.number,
      available: !activeSeatIds.has(seat.id),
    }));
  }
}
