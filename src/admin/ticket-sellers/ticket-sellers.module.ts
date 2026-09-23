import { Module } from '@nestjs/common';

import { AuthModule } from '../../auth/auth.module';
import { TicketSellersController } from './ticket-sellers.controller';
import { TicketSellersService } from './ticket-sellers.service';

@Module({
  imports: [AuthModule],
  controllers: [TicketSellersController],
  providers: [TicketSellersService],
})
export class TicketSellersModule {}
