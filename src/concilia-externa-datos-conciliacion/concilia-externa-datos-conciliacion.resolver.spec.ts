import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaDatosConciliacionResolver } from './concilia-externa-datos-conciliacion.resolver';
import { ConciliaExternaDatosConciliacionService } from './concilia-externa-datos-conciliacion.service';

describe('ConciliaExternaDatosConciliacionResolver', () => {
  let resolver: ConciliaExternaDatosConciliacionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaDatosConciliacionResolver, ConciliaExternaDatosConciliacionService],
    }).compile();

    resolver = module.get<ConciliaExternaDatosConciliacionResolver>(ConciliaExternaDatosConciliacionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
