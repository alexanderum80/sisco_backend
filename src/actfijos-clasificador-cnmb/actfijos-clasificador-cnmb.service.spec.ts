import { Test, TestingModule } from '@nestjs/testing';
import { ActfijosClasificadorCnmbService } from './actfijos-clasificador-cnmb.service';

describe('ActfijosClasificadorCnmbService', () => {
    let service: ActfijosClasificadorCnmbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ActfijosClasificadorCnmbService],
        }).compile();

        service = module.get<ActfijosClasificadorCnmbService>(ActfijosClasificadorCnmbService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
