import { PartialType } from '@nestjs/swagger';
import { CreateTicketSellerDto } from './create-ticket-seller.dto';

export class UpdateTicketSellerDto extends PartialType(CreateTicketSellerDto) {}

