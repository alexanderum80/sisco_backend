import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('conta_categoria_cuenta')
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
