import { SubdivisionesService } from './subdivisiones.service';
import { SubdivisionesEntity } from './subdivisiones.entity';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';

@Resolver(() => SubdivisionesEntity)
export class SubdivisionesResolver {
  constructor(private _subdivisionesSvc: SubdivisionesService) {}

  @Query(() => [SubdivisionesEntity])
  async getAllSubdivisiones(): Promise<SubdivisionesEntity[]> {
    return this._subdivisionesSvc.findAll();
  }

  @Query(() => [SubdivisionesEntity])
  async getSubdivisionesByIdDivision(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<SubdivisionesEntity[]> {
    return this._subdivisionesSvc.findAllByIdDivision(idDivision);
  }
}
