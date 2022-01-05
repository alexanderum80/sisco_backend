import { Test, TestingModule } from '@nestjs/testing';
import { TipoUsuariosResolver } from './tipo-usuarios.resolver';
import { TipoUsuariosService } from './tipo-usuarios.service';

describe('TipoUsuariosResolver', () => {
  let resolver: TipoUsuariosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoUsuariosResolver, TipoUsuariosService],
    }).compile();

    resolver = module.get<TipoUsuariosResolver>(TipoUsuariosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
