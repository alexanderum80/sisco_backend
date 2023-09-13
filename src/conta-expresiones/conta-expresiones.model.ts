import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ContaExpresionResumenInput {
  @Field({ nullable: true })
  IdExpresion?: number;

  @Field()
  Expresion: string;

  @Field({ nullable: true })
  Descripcion: string;

  @Field()
  Acumulado: boolean;

  @Field()
  OperacionesInternas: boolean;

  @Field()
  Centralizada: boolean;

  @Field()
  IdDivision: number;
}

@InputType()
export class ContaExpresionDetalleInput {
  @Field({ nullable: true })
  Id?: number;

  @Field()
  IdExpresion: number;

  @Field({ nullable: true })
  Centro: string;

  @Field({ nullable: true })
  Cta: string;

  @Field({ nullable: true })
  SubCta: string;

  @Field({ nullable: true })
  Crit1: string;

  @Field({ nullable: true })
  Crit2: string;

  @Field({ nullable: true })
  Crit3: string;

  @Field()
  Signo: string;

  @Field()
  PorCiento: number;

  @Field()
  TipoValor: number;
}

@InputType()
export class ContaExpresionInput {
  @Field(() => ContaExpresionResumenInput)
  ExpresionResumen: ContaExpresionResumenInput;

  @Field(() => [ContaExpresionDetalleInput])
  ExpresionesDetalle: ContaExpresionDetalleInput[];
}
