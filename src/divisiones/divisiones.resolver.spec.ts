import { Test, TestingModule } from '@nestjs/testing';
import { DivisionesResolver } from './divisiones.resolver';

describe('DivisionesResolver', () => {
  let resolver: DivisionesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivisionesResolver],
    }).compile();

    resolver = module.get<DivisionesResolver>(DivisionesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
