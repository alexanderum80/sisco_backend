import { Test, TestingModule } from '@nestjs/testing';
import { ContaTipovalorExpresionesResolver } from './conta-tipovalor-expresiones.resolver';

describe('ContaTipovalorExpresionesResolver', () => {
  let resolver: ContaTipovalorExpresionesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaTipovalorExpresionesResolver],
    }).compile();

    resolver = module.get<ContaTipovalorExpresionesResolver>(ContaTipovalorExpresionesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
