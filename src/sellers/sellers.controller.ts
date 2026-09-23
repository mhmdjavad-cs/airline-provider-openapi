import { Controller, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { TicketSellerGuard } from '../auth/guards/ticket-seller.guard';

@ApiTags('Sellers')
@ApiCookieAuth('sessionId')
@Controller('sellers')
@UseGuards(TicketSellerGuard)
export class SellersController {}
