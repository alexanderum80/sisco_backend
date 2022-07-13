import { CargosService } from './cargos.service';
import { Cargos } from './cargos.entity';
import { Query, Resolver } from '@nestjs/graphql';
import { CargosQueryResponse } from './cargos.model';

@Resolver(() => Cargos)
export class CargosResolver {
    constructor(
        private _cargosService: CargosService
    ) {}

    @Query(() => CargosQueryResponse)
    async getAllCargos(): Promise<CargosQueryResponse> {
        return this._cargosService.getAllCargos();
    }
}
