import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { AirportsController } from './airports.controller';
import { AirportsService } from './airports.service';

@Module({
  imports: [AuthModule],
  controllers: [AirportsController],
  providers: [AirportsService],
})
export class AirportsModule {}
