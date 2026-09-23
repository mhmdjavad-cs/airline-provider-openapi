import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from '../../db';
import { airports, airplanes, flights, seats, tickets } from '../../db/schema';

import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsService {
  async create(dto: CreateFlightDto) {
    // Check flight number
    const existingFlight = await db
      .select()
      .from(flights)
      .where(eq(flights.flightNumber, dto.flightNumber));

    if (existingFlight.length > 0) {
      throw new ConflictException('Flight number already exists');
    }

    // Check departure airport
    const departureAirport = await db
      .select()
      .from(airports)
      .where(eq(airports.id, dto.departureAirportId));

    if (!departureAirport[0]) {
      throw new NotFoundException('Departure airport not found');
    }

    // Check arrival airport
    const arrivalAirport = await db
      .select()
      .from(airports)
      .where(eq(airports.id, dto.arrivalAirportId));

    if (!arrivalAirport[0]) {
      throw new NotFoundException('Arrival airport not found');
    }

    if (dto.departureAirportId === dto.arrivalAirportId) {
      throw new ConflictException(
        'Departure and arrival airports must be different',
      );
    }

    // Check airplane
    const airplane = await db
      .select()
      .from(airplanes)
      .where(eq(airplanes.id, dto.airplaneId));

    if (!airplane[0]) {
      throw new NotFoundException('Airplane not found');
    }

    if (new Date(dto.arrivalTime) <= new Date(dto.departureTime)) {
      throw new ConflictException('Arrival time must be after departure time');
    }

    const result = await db
      .insert(flights)
      .values({
        flightNumber: dto.flightNumber,
        price: dto.price,
        departureAirportId: dto.departureAirportId,
        arrivalAirportId: dto.arrivalAirportId,
        airplaneId: dto.airplaneId,
        departureTime: new Date(dto.departureTime),
        arrivalTime: new Date(dto.arrivalTime),
        status: dto.status,
      })
      .returning();

    return result[0];
  }

  async findAll() {
    return db.select().from(flights);
  }

  async findOne(id: number) {
    const result = await db.select().from(flights).where(eq(flights.id, id));

    if (!result[0]) {
      throw new NotFoundException('Flight not found');
    }

    return result[0];
  }

  async update(id: number, dto: UpdateFlightDto) {
    const flight = await this.findOne(id);

    if (dto.flightNumber) {
      const existing = await db
        .select()
        .from(flights)
        .where(eq(flights.flightNumber, dto.flightNumber));

      if (existing.length > 0 && existing[0].id !== id) {
        throw new ConflictException('Flight number already exists');
      }
    }

    const departureAirportId =
      dto.departureAirportId ?? flight.departureAirportId;

    const arrivalAirportId = dto.arrivalAirportId ?? flight.arrivalAirportId;

    const departureTime = dto.departureTime
      ? new Date(dto.departureTime)
      : flight.departureTime;

    const arrivalTime = dto.arrivalTime
      ? new Date(dto.arrivalTime)
      : flight.arrivalTime;

    if (departureAirportId === arrivalAirportId) {
      throw new ConflictException(
        'Departure and arrival airports must be different',
      );
    }

    if (arrivalTime <= departureTime) {
      throw new ConflictException('Arrival time must be after departure time');
    }

    if (dto.departureAirportId) {
      const airport = await db
        .select()
        .from(airports)
        .where(eq(airports.id, dto.departureAirportId));

      if (!airport[0]) {
        throw new NotFoundException('Departure airport not found');
      }
    }

    if (dto.arrivalAirportId) {
      const airport = await db
        .select()
        .from(airports)
        .where(eq(airports.id, dto.arrivalAirportId));

      if (!airport[0]) {
        throw new NotFoundException('Arrival airport not found');
      }
    }

    if (dto.airplaneId) {
      const airplane = await db
        .select()
        .from(airplanes)
        .where(eq(airplanes.id, dto.airplaneId));

      if (!airplane[0]) {
        throw new NotFoundException('Airplane not found');
      }
    }

    const result = await db
      .update(flights)
      .set({
        ...(dto.flightNumber !== undefined && {
          flightNumber: dto.flightNumber,
        }),
        ...(dto.departureAirportId !== undefined && {
          departureAirportId: dto.departureAirportId,
        }),
        ...(dto.arrivalAirportId !== undefined && {
          arrivalAirportId: dto.arrivalAirportId,
        }),
        ...(dto.airplaneId !== undefined && {
          airplaneId: dto.airplaneId,
        }),
        ...(dto.status !== undefined && {
          status: dto.status,
        }),
        departureTime,
        arrivalTime,
        updatedAt: new Date(),
      })
      .where(eq(flights.id, id))
      .returning();

    return result[0];
  }

  async remove(id: number) {
    await this.findOne(id);

    await db.delete(flights).where(eq(flights.id, id));

    return {
      message: 'Flight deleted successfully',
    };
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
      price: flight.price,
      available: !activeSeatIds.has(seat.id),
    }));
  }

  async findTickets(id: number) {
    await this.findOne(id);

    return db.select().from(tickets).where(eq(tickets.flightId, id));
  }
}
