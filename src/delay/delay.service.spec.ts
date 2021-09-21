import { Test, TestingModule } from '@nestjs/testing';
import { DelayService } from './delay.service';

describe('DelayService', () => {
  let service: DelayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DelayService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DelayService>(DelayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
