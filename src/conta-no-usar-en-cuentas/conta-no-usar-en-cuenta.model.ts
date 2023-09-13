import { ContaNoUsarEnCuentaEntity } from './conta-no-usar-en-cuenta.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MultipleQueryResponse, SingleQueryResponse } from '../shared/models/query.response.model';

@ObjectType()
export class ContaNoUsarEnCuentasQueryResponse extends MultipleQueryResponse(ContaNoUsarEnCuentaEntity) {}

@ObjectType()
export class ContaNoUsarEnCuentaQueryResponse extends SingleQueryResponse(ContaNoUsarEnCuentaEntity) {}

@InputType()
export class ContaNoUsarEnCuentaInput {
  @Field()
  Id?: number;

  @Field({ nullable: true })
  Codigo: string;

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

  @Field({ nullable: true })
  Crit4: string;

  @Field({ nullable: true })
  Crit5: string;

  @Field()
  Centralizada: boolean;

  @Field()
  IdDivision: number;
}
