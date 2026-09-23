import { Test, TestingModule } from '@nestjs/testing';
import { AirplanesController } from './airplanes.controller';

describe('AirplanesController', () => {
  let controller: AirplanesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirplanesController],
    }).compile();

    controller = module.get<AirplanesController>(AirplanesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
