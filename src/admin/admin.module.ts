import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { AirportsModule } from './airports/airports.module';
import { AirplanesModule } from './airplanes/airplanes.module';
import { FlightsModule } from './flights/flights.module';
import { TicketSellersModule } from './ticket-sellers/ticket-sellers.module';


@Module({
  imports: [AuthModule, AirportsModule, AirplanesModule, FlightsModule, TicketSellersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
