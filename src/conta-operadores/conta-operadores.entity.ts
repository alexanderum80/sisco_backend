import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_Operadores')
export class ContaOperadoresEntity {
  @Field()
  @PrimaryColumn({ name: 'id' })
  Id: string;

  @Field()
  @Column({ name: 'operador' })
  Operador: string;
}
