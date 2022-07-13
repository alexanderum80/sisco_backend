import { ConcnacContabilidad } from './concilia-nac-contabilidad.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConciliaNacContabilidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [ConcnacContabilidad], { nullable: true })
    data?: ConcnacContabilidad[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ViewConciliaNacContabilidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [ConcnacContabilidad], { nullable: true })
    data?: ConcnacContabilidad[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ViewConciliaNacContabilidad {
    @Field()
    Id: number;

    @Field()
    Annio: string;

    @Field()
    Mes: number;

    @Field()
    Tipo: string;

    @Field()
    CuentaE: string;

    @Field()
    SubCuentaE: string;

    @Field()
    DivisionEmisorE: number;

    @Field()
    Emisor: number;

    @Field()
    DivisionReceptorE: number;

    @Field()
    EmitidoA: number;

    @Field()
    DocumentoE: string;

    @Field()
    FechaE: Date;

    @Field()
    ValorE: number;

    @Field()
    CuentaR: string;

    @Field()
    SubCuentaR: string;

    @Field()
    DivisionReceptorR: number;

    @Field()
    Receptor: number;

    @Field()
    DivisionEmisorR: number;

    @Field()
    RecibidoDe: number;

    @Field()
    DocumentoR: string;

    @Field()
    FechaR: Date;

    @Field()
    ValorR: number;

    @Field()
    DiferenciaDias: number;

    @Field()
    DiferenciaImporte: number;

    @Field()
    Recibido: boolean;
}

@ObjectType()
export class ActaConciliacionQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [ActaConciliacion], { nullable: true })
    data?: ActaConciliacion[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ActaConciliacion {
    @Field()
    ID: number;

    @Field()
    Detalle: number;

    @Field()
    Emisor: number;

    @Field()
    Receptor: number;

    @Field()
    SaldoEmisor: number;

    @Field()
    SaldoReceptor: number;

    @Field()
    Diferencia: number;
}

@InputType()
export class ConciliaNacContabilidadInput {
    @Field()
    Id: number;

    @Field()
    Recibido: boolean;
}
