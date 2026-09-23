import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { AirportsModule } from './airports/airports.module';


@Module({
  imports: [AuthModule, AirportsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
