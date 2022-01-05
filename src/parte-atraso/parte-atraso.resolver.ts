import { ParteAtrasosQueryResponse, DatosIdGAMQueryResponse } from './../concilia-dwh/concilia-dwh.model';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ParteAtrasoService } from './parte-atraso.service';

@Resolver()
export class ParteAtrasoResolver {
    constructor(
        private _parteAtrasoService: ParteAtrasoService
    ) {}

    @Query(() => ParteAtrasosQueryResponse)
    async parteAtrasos(
        @Args({ name: 'idDivision', type: () => Int }) idDivision: number
    ): Promise<ParteAtrasosQueryResponse> {
        return this._parteAtrasoService.parteAtrasos(idDivision);
    }

    @Query(() => DatosIdGAMQueryResponse)
    async datosIdGAM(
        @Args({ name: 'idDivision', type: () => Int }) idDivision: number
    ): Promise<DatosIdGAMQueryResponse> {
        return this._parteAtrasoService.datosIdGAM(idDivision);
    }

}
