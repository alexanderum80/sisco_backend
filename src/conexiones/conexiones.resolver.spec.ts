import { Test, TestingModule } from '@nestjs/testing';
import { ConexionesResolver } from './conexiones.resolver';

describe('ConexionesResolver', () => {
  let resolver: ConexionesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConexionesResolver],
    }).compile();

    resolver = module.get<ConexionesResolver>(ConexionesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
