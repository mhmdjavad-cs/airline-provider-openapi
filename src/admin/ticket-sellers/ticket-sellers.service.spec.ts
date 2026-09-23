import { Test, TestingModule } from '@nestjs/testing';
import { TicketSellersService } from './ticket-sellers.service';

describe('TicketSellersService', () => {
  let service: TicketSellersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketSellersService],
    }).compile();

    service = module.get<TicketSellersService>(TicketSellersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
