import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { FlightsModule } from './flights/flights.module';
import { TicketsModule } from './tickets/tickets.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [AuthModule, FlightsModule, TicketsModule, WalletModule],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
