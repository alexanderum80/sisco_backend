import { Test, TestingModule } from '@nestjs/testing';
import { ParteAtrasoService } from './parte-atraso.service';

describe('ParteAtrasoService', () => {
  let service: ParteAtrasoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParteAtrasoService],
    }).compile();

    service = module.get<ParteAtrasoService>(ParteAtrasoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
