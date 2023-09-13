import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('conta_egastos')
export class ContaElementosGastosEntity {
  @Field()
  @PrimaryColumn({ name: 'egasto' })
  Egasto: string;

  @Field()
  @Column({ name: 'descripcion' })
  Descripcion: string;

  @Field()
  @Column({ name: 'uso_contenido' })
  UsoContenido: string;

  @Field()
  @Column({ name: 'tipo_entidad' })
  TipoEntidad: string;

  @Field()
  @Column({ name: 'cuenta_asociada' })
  CuentaAsociada: string;

  @Field()
  @Column({ name: 'id_epigrafe' })
  IdEpigrafe: number;
}
