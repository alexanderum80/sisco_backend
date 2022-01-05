import { SubdivisionesQueryResponse } from './subdivisiones.model';
import { SubdivisionesService } from './subdivisiones.service';
import { Subdivisiones } from './subdivisiones.entity';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver(of => Subdivisiones)
export class SubdivisionesResolver {
    constructor(
        private _subdivisionesSvc: SubdivisionesService
    ) {}

    @Query(() => SubdivisionesQueryResponse)
    async getAllSubdivisiones(): Promise<SubdivisionesQueryResponse> {
        return this._subdivisionesSvc.getAllSubdivisiones();
    }
}
