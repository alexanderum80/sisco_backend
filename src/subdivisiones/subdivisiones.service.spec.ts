import { Test, TestingModule } from '@nestjs/testing';
import { SubdivisionesService } from './subdivisiones.service';

describe('SubdivisionesService', () => {
  let service: SubdivisionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubdivisionesService],
    }).compile();

    service = module.get<SubdivisionesService>(SubdivisionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
