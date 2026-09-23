import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreateAirportDto {
  @ApiProperty({ example: 'Imam Khomeini International Airport' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'IKA' })
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  code: string;

  @ApiProperty({ example: 'Tehran' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Iran' })
  @IsString()
  country: string;
}
