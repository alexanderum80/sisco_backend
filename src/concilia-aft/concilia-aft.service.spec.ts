import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaAftService } from './concilia-aft.service';

describe('ConciliaAftService', () => {
  let service: ConciliaAftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaAftService],
    }).compile();

    service = module.get<ConciliaAftService>(ConciliaAftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
