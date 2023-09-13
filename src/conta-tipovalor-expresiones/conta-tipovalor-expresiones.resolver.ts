import { Query, Resolver } from '@nestjs/graphql';
import { ContaTipoValorExpresionesEntity } from './conta-tipovalor-expresiones.entity';
import { ContaTipovalorExpresionesService } from './conta-tipovalor-expresiones.service';

@Resolver(() => ContaTipoValorExpresionesEntity)
export class ContaTipovalorExpresionesResolver {
  constructor(private contaTipoValorExpresionesSvc: ContaTipovalorExpresionesService) {}

  @Query(() => [ContaTipoValorExpresionesEntity])
  async getAllContaTipoValorExpresiones(): Promise<ContaTipoValorExpresionesEntity[]> {
    return this.contaTipoValorExpresionesSvc.getAllContaTipoValorExpresiones();
  }
}
