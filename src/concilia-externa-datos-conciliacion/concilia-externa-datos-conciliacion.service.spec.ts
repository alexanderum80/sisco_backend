import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaDatosConciliacionService } from './concilia-externa-datos-conciliacion.service';

describe('ConciliaExternaDatosConciliacionService', () => {
  let service: ConciliaExternaDatosConciliacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaDatosConciliacionService],
    }).compile();

    service = module.get<ConciliaExternaDatosConciliacionService>(ConciliaExternaDatosConciliacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
