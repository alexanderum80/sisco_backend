import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('conta_tipo_valor_expresiones')
export class ContaTipoValorExpresionesEntity {
  @Field()
  @PrimaryColumn({ name: 'id_tipo_valor' })
  IdTipoValor: number;

  @Field()
  @Column({ name: 'valor' })
  Valor: string;
}
