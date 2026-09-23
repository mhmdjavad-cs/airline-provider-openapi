import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin1',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Password1!',
  })
  @IsString()
  @MinLength(8)
  password: string;
}

