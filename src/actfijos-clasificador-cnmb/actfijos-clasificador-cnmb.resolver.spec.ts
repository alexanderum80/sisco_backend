import { Test, TestingModule } from '@nestjs/testing';
import { ActfijosClasificadorCnmbResolver } from './actfijos-clasificador-cnmb.resolver';
import { ActfijosClasificadorCnmbService } from './actfijos-clasificador-cnmb.service';

describe('ActfijosClasificadorCnmbResolver', () => {
    let resolver: ActfijosClasificadorCnmbResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ActfijosClasificadorCnmbResolver, ActfijosClasificadorCnmbService],
        }).compile();

        resolver = module.get<ActfijosClasificadorCnmbResolver>(ActfijosClasificadorCnmbResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
