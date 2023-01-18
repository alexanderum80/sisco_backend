import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaService } from './concilia-externa.service';

describe('ConciliaExternaService', () => {
  let service: ConciliaExternaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaService],
    }).compile();

    service = module.get<ConciliaExternaService>(ConciliaExternaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
