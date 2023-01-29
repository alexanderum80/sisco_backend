import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('Conta_GrupoCuenta')
export class GrupoCuentaEntity {
  @Field(() => String)
  @PrimaryColumn('nvarchar', { length: 2 })
  IdGrupo: string;

  @Field(() => String)
  @Column('nvarchar', { length: 250 })
  Grupo: string;
}
