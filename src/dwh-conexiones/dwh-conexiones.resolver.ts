import { DWHConexionesInput, DWHConexionQueryResponse } from './dwh-conexiones.model';
import { MutationResponse } from './../shared/models/mutation.response.model';
import { DwhConexionesService } from './dwh-conexiones.service';
import { DWHConexiones } from './dwh-conexiones.entity';
import { Mutation, Resolver, Args, Query, Int } from '@nestjs/graphql';

@Resolver(() => DWHConexiones)
export class DwhConexionesResolver {
    constructor(private _dwhConexionesService: DwhConexionesService) {}

    @Query(() => DWHConexionQueryResponse)
    async getDWHConexion(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<DWHConexionQueryResponse> {
        return this._dwhConexionesService.getDWHConexion(idDivision);
    }

    @Mutation(() => MutationResponse)
    async updateDWhConexion(@Args({ name: 'dwhConexionInput', type: () => DWHConexionesInput }) dwhConexionInput: DWHConexionesInput): Promise<MutationResponse> {
        return this._dwhConexionesService.updateDWhConexion(dwhConexionInput);
    }
}
