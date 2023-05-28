import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('concext_concilia_entre_unidades')
export class ConciliaExternaEntreUnidadesEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  ID: number;

  @Field()
  @Column({ name: 'anno' })
  Annio: number;

  @Field()
  @Column({ name: 'mes' })
  Mes: number;

  @Field()
  @Column({ name: 'id_unidad' })
  IdUnidad: number;

  @Field()
  @Column({ name: 'id_unidad_od' })
  IdUnidadOD: number;

  @Field({ nullable: true })
  @Column({ name: 'id_usuario_emisor' })
  IdUsuarioEmisor?: number;

  @Field({ nullable: true })
  @Column({ name: 'id_usuario_receptor' })
  IdUsuarioReceptor?: number;

  @Field({ nullable: true })
  @Column({ name: 'id_usuario_supervisor' })
  IdUsuarioSupervisor?: number;

  @Field({ nullable: true })
  @Column({ name: 'nota' })
  Nota?: string;
}

@ObjectType()
export class ConciliaExternaCentrosNoConciliados {
  @Field()
  Emisor: string;

  @Field()
  Receptor: string;
}
