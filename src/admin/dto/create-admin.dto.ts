import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: 'admin1',
    description: 'Unique username for the administrator',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Unique email address of the administrator',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password1!',
    description: 'Password for the administrator account',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  password: string;
}
