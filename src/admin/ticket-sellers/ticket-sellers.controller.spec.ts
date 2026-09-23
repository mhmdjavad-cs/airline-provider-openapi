import { Test, TestingModule } from '@nestjs/testing';
import { TicketSellersController } from './ticket-sellers.controller';

describe('TicketSellersController', () => {
  let controller: TicketSellersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketSellersController],
    }).compile();

    controller = module.get<TicketSellersController>(TicketSellersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
