import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    example: 13,
    description: 'Flight ID',
  })
  @IsInt()
  @Min(1)
  flightId: number;

  @ApiProperty({
    example: 25,
    description: 'Seat ID',
  })
  @IsInt()
  @Min(1)
  seatId: number;

  @ApiProperty({
    example: 'John Smith',
  })
  @IsString()
  @MinLength(1)
  passengerName: string;

  @ApiProperty({
    example: 'P12345678',
  })
  @IsString()
  @MinLength(1)
  passengerPassportNumber: string;
}
