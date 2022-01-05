import { Test, TestingModule } from '@nestjs/testing';
import { EpigrafesService } from './epigrafes.service';

describe('EpigrafesService', () => {
  let service: EpigrafesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpigrafesService],
    }).compile();

    service = module.get<EpigrafesService>(EpigrafesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
