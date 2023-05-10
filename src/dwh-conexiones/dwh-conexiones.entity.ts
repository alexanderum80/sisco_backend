import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('dwh_conexiones')
export class DWHConexiones {
  @Field()
  @PrimaryColumn({ name: 'id_unidad' })
  IdUnidad: number;

  @Field({ nullable: true })
  @Column({ name: 'conexion_rest' })
  ConexionRest?: string;

  @Field({ nullable: true })
  @Column({ name: 'conexion_dwh' })
  ConexionDWH?: string;
}
