import { Test, TestingModule } from '@nestjs/testing';
import { DivisionesService } from './divisiones.service';

describe('DivisionesService', () => {
  let service: DivisionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivisionesService],
    }).compile();

    service = module.get<DivisionesService>(DivisionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
