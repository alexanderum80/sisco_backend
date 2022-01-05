import { Test, TestingModule } from '@nestjs/testing';
import { SubdivisionesResolver } from './subdivisiones.resolver';

describe('SubdivisionesResolver', () => {
  let resolver: SubdivisionesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubdivisionesResolver],
    }).compile();

    resolver = module.get<SubdivisionesResolver>(SubdivisionesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
