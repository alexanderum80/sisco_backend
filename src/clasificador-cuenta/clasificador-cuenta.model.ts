import { MultipleQueryResponse, SingleQueryResponse } from 'src/shared/models/query.response.model';
import { ClasificadorCuentaReal } from './clasificador-cuenta.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class ClasificadorCuentaQueryResponse extends SingleQueryResponse(ClasificadorCuentaReal) {}

@ObjectType()
export class ClasificadorCuentasQueryResponse extends MultipleQueryResponse(ClasificadorCuentaReal) {}

@InputType()
export class ClasificadorCuentaRealDTO {
    @Field()
    Cuenta: string;

    @Field()
    SubCuenta: string;

    @Field()
    Descripcion: string;

    @Field()
    Naturaleza: string;

    @Field()
    Crit1: string;

    @Field()
    Crit2: string;

    @Field()
    Crit3: string;

    @Field()
    Obligacion: boolean;

    @Field()
    TipoClasificador: number;

    @Field()
    SeUtiliza: string;

    @Field()
    Terminal: boolean;

    @Field()
    Crit1Consolidacion: string;

    @Field()
    Crit2Consolidacion: string;

    @Field()
    Crit3Consolidacion: string;
}

@ObjectType()
export class CuentasAgrupadas {
    @Field()
    Cuenta: string;
}

@ObjectType()
export class CuentasAgrupadasQueryResponse extends MultipleQueryResponse(CuentasAgrupadas) {}

export enum ETipoClasificadorCuenta {
    Consolidado = 1,
    Centro = 2,
    Complejo = 3
}