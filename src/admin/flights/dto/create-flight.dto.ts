import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateFlightDto {
  @ApiProperty({
    example: 'J2-101',
  })
  @IsString()
  @MinLength(1)
  flightNumber: string;

  @ApiProperty({
  example: 15000,
  description: 'Ticket price in cents. 15000 = $150.00',
  minimum: 1,
  })
  @IsInt()
  @Min(1)
  price: number;


  @ApiProperty({
    example: 1,
    description: 'Departure airport ID',
  })
  @IsInt()
  @Min(1)
  departureAirportId: number;

  @ApiProperty({
    example: 2,
    description: 'Arrival airport ID',
  })
  @IsInt()
  @Min(1)
  arrivalAirportId: number;

  @ApiProperty({
    example: 1,
    description: 'Airplane ID',
  })
  @IsInt()
  @Min(1)
  airplaneId: number;

  @ApiProperty({
    example: '2026-10-01T08:00:00.000Z',
  })
  @IsDateString()
  departureTime: string;

  @ApiProperty({
    example: '2026-10-01T11:30:00.000Z',
  })
  @IsDateString()
  arrivalTime: string;

  @ApiProperty({
    example: 'SCHEDULED',
    enum: ['SCHEDULED', 'BOARDING', 'DEPARTED', 'ARRIVED', 'CANCELLED'],
  })
  @IsString()
  status: string;
}
