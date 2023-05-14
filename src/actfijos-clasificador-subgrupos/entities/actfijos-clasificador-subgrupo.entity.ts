import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
@Entity('actfijos_clasificador_subgrupos')
export class ActFijosClasificadorSubgrupoEntity {
  @Field(() => Int)
  @PrimaryColumn('int', { name: 'grupo' })
  Grupo: number;

  @Field(() => Int)
  @PrimaryColumn('int', { name: 'codigo' })
  Codigo: number;

  @Field()
  @Column('varchar', { name: 'descripcion', length: 64 })
  Descripcion: string;

  @Field(() => Float)
  @Column('float', { name: 'tasa', precision: 18 })
  Tasa: number;
}
