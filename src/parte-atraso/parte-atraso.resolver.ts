import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ParteAtrasoService } from './parte-atraso.service';
import { DatosIdGamEntity, ParteAtrasoEntity } from './parte-atraso.entity';

@Resolver()
export class ParteAtrasoResolver {
  constructor(private _parteAtrasoService: ParteAtrasoService) {}

  @Query(() => [ParteAtrasoEntity])
  async parteAtrasos(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<ParteAtrasoEntity[]> {
    return this._parteAtrasoService.parteAtrasos(idDivision);
  }

  @Query(() => [DatosIdGamEntity])
  async datosIdGAM(@Args({ name: 'idDivision', type: () => Int }) idDivision: number): Promise<DatosIdGamEntity[]> {
    return this._parteAtrasoService.datosIdGAM(idDivision);
  }
}
