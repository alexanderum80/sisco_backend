import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('Conta_CategoriaCuenta')
export class CategoriaCuentaEntity {
  @Field()
  @PrimaryColumn()
  IdCategoria: string;

  @Field(() => Int)
  @Column()
  IdClase: number;

  @Field()
  @Column()
  Categoria: string;
}
