import { Test, TestingModule } from '@nestjs/testing';
import { ContaConexionesService } from './conta-conexiones.service';

describe('ContaConexionesService', () => {
  let service: ContaConexionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContaConexionesService],
    }).compile();

    service = module.get<ContaConexionesService>(ContaConexionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
