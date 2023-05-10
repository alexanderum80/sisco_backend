import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('Conta_Categoria_Cuenta')
export class CategoriaCuentaEntity {
  @Field()
  @PrimaryColumn({ name: 'id_categoria' })
  IdCategoria: string;

  @Field(() => Int)
  @Column({ name: 'id_clase' })
  IdClase: number;

  @Field()
  @Column({ name: 'categoria' })
  Categoria: string;
}
