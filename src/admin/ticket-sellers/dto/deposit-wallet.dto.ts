import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DepositWalletDto {
  @ApiProperty({
    example: 50000,
    description: 'Amount to deposit in cents. 50000 = $500.00',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  amount: number;
}
