import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaInternaContaService } from './concilia-interna-conta.service';

describe('ConciliaInternaContaService', () => {
  let service: ConciliaInternaContaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaInternaContaService],
    }).compile();

    service = module.get<ConciliaInternaContaService>(ConciliaInternaContaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
