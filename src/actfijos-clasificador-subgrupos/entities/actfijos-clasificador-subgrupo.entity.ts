import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
@Entity('ActFijos_ClasificadorSubgrupos')
export class ActFijosClasificadorSubgrupoEntity {
  @Field(() => Int)
  @PrimaryColumn('int')
  Grupo: number;

  @Field(() => Int)
  @PrimaryColumn('int')
  Codigo: number;

  @Field()
  @Column('varchar', { name: 'Descripcion', length: 64 })
  Descripcion: string;

  @Field(() => Float)
  @Column('float', { name: 'Tasa', precision: 18 })
  Tasa: number;
}
