import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaInternaDwhService } from './concilia-interna-dwh.service';

describe('ConciliaInternaDwhService', () => {
  let service: ConciliaInternaDwhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaInternaDwhService],
    }).compile();

    service = module.get<ConciliaInternaDwhService>(ConciliaInternaDwhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
