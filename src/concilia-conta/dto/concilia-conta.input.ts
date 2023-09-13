import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ConciliaContaInput {
  @Field()
  idCentro: number;

  @Field()
  periodo: number;

  @Field()
  annio: number;

  @Field()
  tipoCentro: number;

  @Field()
  tipoEntidad: number;
}

@InputType()
export class IniciarSaldosInput {
  @Field()
  idCentro: number;

  @Field()
  consolidado: boolean;

  @Field()
  annio: number;
}

@InputType()
export class ChequearCentrosInput {
  @Field()
  idCentro: number;

  @Field()
  annio: number;

  @Field()
  periodo: number;

  @Field(() => [Int])
  centrosAChequear: number[];
}
