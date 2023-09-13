import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('conta_clasificador_cuentas_real')
export class ClasificadorCuentaRealEntity {
  @Field()
  @PrimaryColumn({ name: 'tipo_clasificador' })
  TipoClasificador: number;

  @Field()
  @PrimaryColumn({ name: 'cuenta' })
  Cuenta: string;

  @Field()
  @PrimaryColumn({ name: 'subcuenta' })
  SubCuenta: string;

  @Field()
  @Column({ name: 'nombre', nullable: true })
  Nombre: string;

  @Field()
  @Column({ name: 'naturaleza', length: 1 })
  Naturaleza: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_1', nullable: true })
  Tipo_Analisis_1?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_2', nullable: true })
  Tipo_Analisis_2?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_3', nullable: true })
  Tipo_Analisis_3?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_4', nullable: true })
  Tipo_Analisis_4?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_5', nullable: true })
  Tipo_Analisis_5?: string;

  @Field({ defaultValue: false })
  @Column({ name: 'obligacion', default: false })
  Obligacion: boolean;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_moneda', nullable: true })
  Tipo_Moneda?: string;

  @Field()
  @Column('varchar', { name: 'grupo' })
  Grupo?: string;

  @Field()
  @Column('varchar', { name: 'clase' })
  Clase?: string;

  @Field()
  @Column('varchar', { name: 'categoria' })
  Categoria?: string;

  @Field()
  @Column({ name: 'clasificacion', length: 1 })
  Clasificacion?: string;

  @Field()
  @Column({ name: 'tipo', length: 1 })
  Tipo?: string;

  @Field()
  @Column({ name: 'estado', length: 1 })
  Estado?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_1_cons', nullable: true })
  Tipo_Analisis_1_Cons?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_2_cons', nullable: true })
  Tipo_Analisis_2_Cons?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_3_cons', nullable: true })
  Tipo_Analisis_3_Cons?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_4_cons', nullable: true })
  Tipo_Analisis_4_Cons?: string;

  @Field({ nullable: true })
  @Column('varchar', { name: 'tipo_analisis_5_cons', nullable: true })
  Tipo_Analisis_5_Cons?: string;

  @Field({ nullable: true })
  @Column({ name: 'se_utiliza', nullable: true })
  SeUtiliza?: string;
}
