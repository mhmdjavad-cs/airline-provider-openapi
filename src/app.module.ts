import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [AuthModule, AdminModule, SellersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
