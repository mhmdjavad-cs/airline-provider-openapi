import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateTicketSellerDto {
  @ApiProperty({
    example: 'Ali Rezaei',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: 'ali.rezaei',
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'ali@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password1!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  @Matches(/[^A-Za-z0-9]/)
  password: string;

  @ApiProperty({
    example: 'ACTIVE',
    enum: ['ACTIVE', 'SUSPENDED'],
  })
  @IsString()
  status: string;
}
