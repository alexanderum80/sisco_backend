import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_Tipo_Valor_Expresiones')
export class ContaTipoValorExpresionesEntity {
  @Field()
  @PrimaryColumn({ name: 'id_tipo_valor' })
  IdTipoValor: number;

  @Field()
  @Column()
  Valor: string;
}
