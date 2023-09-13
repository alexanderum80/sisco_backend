import { Test, TestingModule } from '@nestjs/testing';
import { ActfijosClasificadorSubgruposService } from './actfijos-clasificador-subgrupos.service';

describe('ActfijosClasificadorSubgruposService', () => {
  let service: ActfijosClasificadorSubgruposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActfijosClasificadorSubgruposService],
    }).compile();

    service = module.get<ActfijosClasificadorSubgruposService>(ActfijosClasificadorSubgruposService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
