import { Module } from '@nestjs/common';

import { AuthModule } from '../../auth/auth.module';
import { AirplanesController } from './airplanes.controller';
import { AirplanesService } from './airplanes.service';

@Module({
  imports: [AuthModule],
  controllers: [AirplanesController],
  providers: [AirplanesService],
})
export class AirplanesModule {}
