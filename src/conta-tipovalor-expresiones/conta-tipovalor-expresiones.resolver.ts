import { Query, Resolver } from '@nestjs/graphql';
import { ContaTipoValorExpresionesEntity } from './conta-tipovalor-expresiones.entity';
import { ContaTipoValorExpresionesQueryResponse } from './conta-tipovalor-expresiones.model';
import { ContaTipovalorExpresionesService } from './conta-tipovalor-expresiones.service';

@Resolver(of => ContaTipoValorExpresionesEntity)
export class ContaTipovalorExpresionesResolver {
    constructor(
        private contaTipoValorExpresionesSvc: ContaTipovalorExpresionesService
    ) {}

    @Query(() => ContaTipoValorExpresionesQueryResponse)
    async getAllContaTipoValorExpresiones(): Promise<ContaTipoValorExpresionesQueryResponse> {
        return this.contaTipoValorExpresionesSvc.getAllContaTipoValorExpresiones();
    }
}
