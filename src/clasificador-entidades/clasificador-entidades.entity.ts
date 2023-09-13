import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('conta_clasificar_unidades')
export class ClasificarEntidadesEntity {
  @Field()
  @PrimaryColumn({ name: 'id_unidad' })
  IdUnidad: number;

  @Field({ nullable: true })
  Unidad: string;

  @Field()
  @Column({ name: 'id_tipo_entidad' })
  IdTipoEntidad: number;

  @Field()
  TipoEntidad: string;

  @Field()
  Division: string;

  @Field()
  SubDivision: string;
}
