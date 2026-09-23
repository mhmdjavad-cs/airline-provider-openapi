
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateAirplaneDto {
  @ApiProperty({
    example: 'Airbus A320',
  })
  @IsString()
  @MinLength(1)
  model: string;

  @ApiProperty({
    example: '4K-AZ01',
  })
  @IsString()
  @MinLength(1)
  registrationNumber: string;

  @ApiProperty({
    example: 180,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    example: 'ACTIVE',
    enum: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'],
  })
  @IsString()
  status: string;
}

