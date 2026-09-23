import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { airports } from '../../db/schema';
import { CreateAirportDto } from './dto/create-airport.dto';

@Injectable()
export class AirportsService {
  async create(dto: CreateAirportDto) {
    const existing = await db
      .select()
      .from(airports)
      .where(eq(airports.code, dto.code));

    if (existing.length > 0) {
      throw new ConflictException('Airport code already exists');
    }

    const result = await db.insert(airports).values(dto).returning();

    return result[0];
  }

  async findAll() {
    return db.select().from(airports);
  }

  async findOne(id: number) {
    const result = await db.select().from(airports).where(eq(airports.id, id));

    if (!result[0]) {
      throw new NotFoundException('Airport not found');
    }

    return result[0];
  }

  async update(id: number, dto: Partial<CreateAirportDto>) {
    await this.findOne(id);

    const result = await db
      .update(airports)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(airports.id, id))
      .returning();

    return result[0];
  }

  async remove(id: number) {
    await this.findOne(id);

    await db.delete(airports).where(eq(airports.id, id));

    return {
      message: 'Airport deleted successfully',
    };
  }
}
