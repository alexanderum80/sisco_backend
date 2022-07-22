import { Test, TestingModule } from '@nestjs/testing';
import { CajaConfiguracionResolver } from './caja-configuracion.resolver';
import { CajaConfiguracionService } from './caja-configuracion.service';

describe('CajaConfiguracionResolver', () => {
  let resolver: CajaConfiguracionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CajaConfiguracionResolver, CajaConfiguracionService],
    }).compile();

    resolver = module.get<CajaConfiguracionResolver>(CajaConfiguracionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
