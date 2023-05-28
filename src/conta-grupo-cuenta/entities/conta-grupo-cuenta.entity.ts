import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('conta_grupo_cuenta')
export class GrupoCuentaEntity {
  @Field(() => String)
  @PrimaryColumn('varchar', { name: 'id_grupo', length: 2 })
  IdGrupo: string;

  @Field(() => String)
  @Column('varchar', { name: 'grupo', length: 250 })
  Grupo: string;
}
