import { Test, TestingModule } from '@nestjs/testing';
import { ActfijosClasificadorSubgruposResolver } from './actfijos-clasificador-subgrupos.resolver';
import { ActfijosClasificadorSubgruposService } from './actfijos-clasificador-subgrupos.service';

describe('ActfijosClasificadorSubgruposResolver', () => {
  let resolver: ActfijosClasificadorSubgruposResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActfijosClasificadorSubgruposResolver, ActfijosClasificadorSubgruposService],
    }).compile();

    resolver = module.get<ActfijosClasificadorSubgruposResolver>(ActfijosClasificadorSubgruposResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
