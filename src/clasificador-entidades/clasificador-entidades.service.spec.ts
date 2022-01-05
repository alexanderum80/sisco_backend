import { Test, TestingModule } from '@nestjs/testing';
import { ClasificadorEntidadesService } from './clasificador-entidades.service';

describe('ClasificadorEntidadesService', () => {
  let service: ClasificadorEntidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClasificadorEntidadesService],
    }).compile();

    service = module.get<ClasificadorEntidadesService>(ClasificadorEntidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
