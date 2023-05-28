import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('conta_expresiones_resumen')
export class ExpresionesResumenEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id_expresion' })
  IdExpresion: number;

  @Field()
  @Column({ name: 'expresion' })
  Expresion: string;

  @Field({ nullable: true })
  @Column({ name: 'descripcion' })
  Descripcion: string;

  @Field()
  @Column({ name: 'acumulado' })
  Acumulado: boolean;

  @Field()
  @Column({ name: 'operaciones_internas' })
  OperacionesInternas: boolean;

  @Field()
  @Column({ name: 'centralizada' })
  Centralizada: boolean;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;
}

@ObjectType()
@Entity('conta_expresiones_detalle')
export class ExpresionesDetalleEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @Field()
  @Column({ name: 'id_expresion' })
  IdExpresion: number;

  @Field({ nullable: true })
  @Column({ name: 'centro', type: 'varchar', length: 3 })
  Centro: string;

  @Field({ nullable: true })
  @Column({ name: 'cta', type: 'varchar', length: 8 })
  Cta: string;

  @Field({ nullable: true })
  @Column({ name: 'subcta', type: 'varchar', length: 8 })
  SubCta: string;

  @Field({ nullable: true })
  @Column({ name: 'crit1', type: 'varchar', length: 10 })
  Crit1: string;

  @Field({ nullable: true })
  @Column({ name: 'crit2', type: 'varchar', length: 10 })
  Crit2: string;

  @Field({ nullable: true })
  @Column({ name: 'crit3', type: 'varchar', length: 10 })
  Crit3: string;

  @Field()
  @Column({ name: 'signo', type: 'varchar', length: 1 })
  Signo: string;

  @Field()
  @Column({ name: 'por_ciento' })
  PorCiento: number;

  @Field()
  @Column({ name: 'tipo_valor' })
  TipoValor: number;

  @Field({ nullable: true })
  TipoValorDesc?: string;
}
