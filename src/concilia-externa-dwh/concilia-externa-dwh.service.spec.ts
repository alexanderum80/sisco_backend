import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaDwhService } from './concilia-externa-dwh.service';

describe('ConciliaExternaDwhService', () => {
  let service: ConciliaExternaDwhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaDwhService],
    }).compile();

    service = module.get<ConciliaExternaDwhService>(ConciliaExternaDwhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
