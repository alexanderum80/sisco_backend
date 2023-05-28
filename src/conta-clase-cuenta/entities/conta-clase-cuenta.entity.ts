import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('conta_clase_cuenta')
export class ClaseCuentaEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'id' })
  ID: number;

  @Field()
  @Column({ name: 'id_clase' })
  IdClase: string;

  @Field()
  @Column({ name: 'id_grupo' })
  IdGrupo: string;

  @Field()
  @Column({ name: 'clase' })
  Clase: string;
}
