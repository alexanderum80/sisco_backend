import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_ClasificadorCuentas_Real')
export class ClasificadorCuentaReal {
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
  @Column({ length: 3, nullable: true })
  Tipo_de_analisis_1?: string;

  @Field({ nullable: true })
  @Column({ length: 3, nullable: true })
  Tipo_de_analisis_2?: string;

  @Field({ nullable: true })
  @Column({ length: 3, nullable: true })
  Tipo_de_analisis_3?: string;

  @Field({ nullable: true })
  @Column({ length: 3, nullable: true })
  Tipo_de_analisis_4?: string;

  @Field({ nullable: true })
  @Column({ length: 3, nullable: true })
  Tipo_de_analisis_5?: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  Obligacion: boolean;

  @Field({ nullable: true })
  @Column({ length: 3, nullable: true })
  Tipo_Moneda?: string;

  @Field()
  @Column({ length: 2 })
  Grupo?: string;

  @Field()
  @Column({ length: 2 })
  Clase?: string;

  @Field()
  @Column({ length: 8 })
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
  @Column()
  SeUtiliza?: string;
}
