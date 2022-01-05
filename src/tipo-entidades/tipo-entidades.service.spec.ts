import { Test, TestingModule } from '@nestjs/testing';
import { TipoEntidadesService } from './tipo-entidades.service';

describe('TipoEntidadesService', () => {
  let service: TipoEntidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoEntidadesService],
    }).compile();

    service = module.get<TipoEntidadesService>(TipoEntidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
