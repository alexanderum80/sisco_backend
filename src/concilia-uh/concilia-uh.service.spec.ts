import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaUhService } from './concilia-uh.service';

describe('ConciliaUhService', () => {
  let service: ConciliaUhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaUhService],
    }).compile();

    service = module.get<ConciliaUhService>(ConciliaUhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
