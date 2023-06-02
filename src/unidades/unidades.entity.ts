import { Field, ObjectType } from '@nestjs/graphql';
import { DivisionesEntity } from 'src/divisiones/divisiones.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';

@ObjectType()
@Entity('unidades')
export class UnidadesEntity {
  @Field()
  @PrimaryColumn({ name: 'id_unidad' })
  IdUnidad: number;

  @Field({ nullable: true })
  @Column({ name: 'nombre' })
  Nombre: string;

  @Field({ nullable: true })
  @Column({ name: 'id_complejo' })
  IdComplejo: number;

  @Field({ nullable: true })
  @Column({ name: 'id_subdivision' })
  IdSubdivision: number;

  @Field({ nullable: true })
  @Column({ name: 'id_division' })
  IdDivision: number;

  @Field(() => DivisionesEntity)
  @ManyToOne(() => DivisionesEntity, divisiones => divisiones.IdDivision)
  @JoinColumn({ name: 'id_division', referencedColumnName: 'IdDivision' })
  Division?: DivisionesEntity;

  @Field({ nullable: true })
  @Column({ name: 'provincia' })
  Provincia: number;

  @Field({ nullable: true })
  @Column({ name: 'tipo' })
  Tipo: number;

  @Field({ nullable: true })
  @Column({ name: 'abierta' })
  Abierta: boolean;
}

@ObjectType()
@ViewEntity('v_centros')
export class CentrosView {
  @Field()
  @ViewColumn({ name: 'id_unidad' })
  @PrimaryColumn({ name: 'id_unidad' })
  IdUnidad: number;

  @Field()
  @ViewColumn({ name: 'nombre' })
  Nombre: string;

  @Field()
  @ViewColumn({ name: 'id_subdivision' })
  IdSubdivision: number;

  @Field()
  @ViewColumn({ name: 'subdivision' })
  Subdivision: string;

  @Field()
  @ViewColumn({ name: 'id_division' })
  IdDivision: number;

  @Field()
  @ViewColumn({ name: 'division' })
  Division: string;
}
