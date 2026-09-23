import { Module } from '@nestjs/common';
import { SessionService } from './session/session.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [SessionService],
  exports: [SessionService],
  controllers: [AuthController],
})
export class AuthModule {}
