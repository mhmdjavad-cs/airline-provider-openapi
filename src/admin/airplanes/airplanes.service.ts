import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from '../../db';
import { airplanes, flights, seats } from '../../db/schema';

import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';

@Injectable()
export class AirplanesService {
  async create(dto: CreateAirplaneDto) {
    const existing = await db
      .select()
      .from(airplanes)
      .where(eq(airplanes.registrationNumber, dto.registrationNumber));

    if (existing.length > 0) {
      throw new ConflictException('Registration number already exists');
    }

    const result = await db.insert(airplanes).values(dto).returning();

    const airplane = result[0];

    // Automatically generate seats.
    const seatValues = Array.from({ length: dto.capacity }, (_, index) => ({
      airplaneId: airplane.id,
      number: `${index + 1}`,
    }));

    await db.insert(seats).values(seatValues);

    return airplane;
  }

  async findAll() {
    return db.select().from(airplanes);
  }

  async findOne(id: number) {
    const result = await db
      .select()
      .from(airplanes)
      .where(eq(airplanes.id, id));

    if (!result[0]) {
      throw new NotFoundException('Airplane not found');
    }

    return result[0];
  }

  async update(id: number, dto: UpdateAirplaneDto) {
    await this.findOne(id);

    if (dto.registrationNumber) {
      const existing = await db
        .select()
        .from(airplanes)
        .where(eq(airplanes.registrationNumber, dto.registrationNumber));

      if (existing.length > 0 && existing[0].id !== id) {
        throw new ConflictException('Registration number already exists');
      }
    }

    // Capacity should not be changed because seats are
    // generated when the airplane is created.
    const { capacity, ...updateData } = dto;

    const result = await db
      .update(airplanes)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(airplanes.id, id))
      .returning();

    return result[0];
  }

  async remove(id: number) {
    await this.findOne(id);

    await db.delete(airplanes).where(eq(airplanes.id, id));

    return {
      message: 'Airplane deleted successfully',
    };
  }

  async findFlights(id: number) {
    await this.findOne(id);

    return db.select().from(flights).where(eq(flights.airplaneId, id));
  }
}
