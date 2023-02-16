import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_ClasificadorCuentas_Real')
export class ClasificadorCuentaRealEntity {
  @Field()
  @PrimaryColumn()
  TipoClasificador: number;

  @Field()
  @PrimaryColumn()
  Cuenta: string;

  @Field()
  @PrimaryColumn()
  SubCuenta: string;

  @Field()
  @Column({ nullable: true })
  Nombre: string;

  @Field()
  @Column({ length: 1 })
  Naturaleza: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_1?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_2?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_3?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_4?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_5?: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  Obligacion: boolean;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Moneda?: string;

  @Field()
  @Column('nvarchar')
  Grupo?: string;

  @Field()
  @Column('nvarchar')
  Clase?: string;

  @Field()
  @Column('nvarchar')
  Categoria?: string;

  @Field()
  @Column({ length: 1 })
  Clasificacion?: string;

  @Field()
  @Column({ length: 1 })
  Tipo?: string;

  @Field()
  @Column({ length: 1 })
  Estado?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_1_Cons?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_2_Cons?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_3_Cons?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_4_Cons?: string;

  @Field({ nullable: true })
  @Column('nvarchar', { nullable: true })
  Tipo_Analisis_5_Cons?: string;

  @Field({ nullable: true })
  @Column()
  SeUtiliza?: string;
}
