import { CentrosView } from './../unidades/unidades.entity';
import { DivisionesEntity } from './../divisiones/divisiones.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'conta_conexiones' })
export class ContaConexionesEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @Field()
  @Column({ name: 'id_unidad' })
  IdUnidad: number;

  @Field(() => CentrosView)
  @ManyToOne(() => CentrosView, centros => centros.IdUnidad)
  @JoinColumn({ name: 'id_unidad', referencedColumnName: 'IdUnidad' })
  Unidad?: CentrosView;

  @Field()
  @Column({ name: 'consolidado' })
  Consolidado: boolean;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;

  @Field(() => DivisionesEntity)
  @ManyToOne(() => DivisionesEntity, divisiones => divisiones.IdDivision)
  @JoinColumn({ name: 'id_division', referencedColumnName: 'IdDivision' })
  Division: DivisionesEntity;

  @Field({ nullable: true })
  @Column({ name: 'ip_rodas' })
  IpRodas: string;

  @Field({ nullable: true })
  @Column({ name: 'base_datos' })
  BaseDatos: string;

  @Field({ nullable: true })
  @Column('timestamp', { name: 'fecha_actualizacion' })
  FechaActualizacion?: Date;
}
