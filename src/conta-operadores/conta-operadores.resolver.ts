import { ContaOperadoresQueryResponse } from './conta-operadores.model';
import { ContaOperadoresService } from './conta-operadores.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ContaOperadoresResolver {
  constructor(private _contaOperadoresSvc: ContaOperadoresService) {}

  @Query(() => ContaOperadoresQueryResponse)
  async getAllOperadores(): Promise<ContaOperadoresQueryResponse> {
    return this._contaOperadoresSvc.getAllOperadores();
  }
}
