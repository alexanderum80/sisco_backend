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

    @Field({ nullable: true })
    Crit1: string;

    @Field({ nullable: true })
    Crit2: string;

    @Field({ nullable: true })
    Crit3: string;

    @Field()
    Obligacion: boolean;

    @Field()
    TipoClasificador: number;

    @Field({ nullable: true })
    SeUtiliza: string;

    @Field()
    Terminal: boolean;

    @Field({ nullable: true })
    Crit1Consolidacion: string;

    @Field({ nullable: true })
    Crit2Consolidacion: string;

    @Field({ nullable: true })
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