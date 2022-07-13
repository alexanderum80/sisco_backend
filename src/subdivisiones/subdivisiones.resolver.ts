import { SubdivisionesQueryResponse } from './subdivisiones.model';
import { SubdivisionesService } from './subdivisiones.service';
import { Subdivisiones } from './subdivisiones.entity';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';

@Resolver(() => Subdivisiones)
export class SubdivisionesResolver {
    constructor(
        private _subdivisionesSvc: SubdivisionesService
    ) {}

    @Query(() => SubdivisionesQueryResponse)
    async getAllSubdivisiones(): Promise<SubdivisionesQueryResponse> {
        return this._subdivisionesSvc.findAll();
    }

    @Query(() => SubdivisionesQueryResponse)
    async getSubdivisionesByIdDivision(
        @Args({ name: 'idDivision', type: () => Int }) idDivision: number
    ): Promise<SubdivisionesQueryResponse> {
        return this._subdivisionesSvc.findAllByIdDivision(idDivision);
    }
}
