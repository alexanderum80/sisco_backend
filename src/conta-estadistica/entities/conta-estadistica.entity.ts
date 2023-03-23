import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ContaEstadisticaView {
  @Field(() => Int)
  IdDivision: number;

  @Field()
  Division: string;

  @Field(() => Int)
  IdCentro: number;

  @Field()
  Centro: string;

  @Field(() => Boolean)
  Consolidado: boolean;

  @Field(() => Int)
  Annio: number;

  @Field(() => Int)
  Periodo: number;

  @Field(() => Date, { nullable: true })
  FechaActualizacion?: Date;

  @Field(() => Date, { nullable: true })
  FechaInicio?: Date;

  @Field(() => Date, { nullable: true })
  FechaFin?: Date;

  @Field(() => Int)
  Comprobantes: number;

  @Field(() => Int)
  Traspasados: number;

  @Field(() => Int)
  SinTraspasar: number;

  @Field(() => Int)
  Inconclusos: number;

  @Field(() => Int)
  Anulados: number;
}

@ObjectType()
@Entity('Conta_Estadistica')
export class ContaEstadisticaEntity {
  @Column()
  @Field()
  Division: string;

  @PrimaryColumn()
  @Field()
  Centro: string;

  @PrimaryColumn()
  @Field(() => Boolean)
  Consolidado: boolean;

  @Column()
  @Field(() => Int)
  Annio: number;

  @Column()
  @Field(() => Int)
  Periodo: number;

  @Column()
  @Field(() => Date, { nullable: true })
  FechaActualizacion?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  FechaInicio?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  FechaFin?: Date;

  @Column()
  @Field(() => Int)
  Comprobantes: number;

  @Column()
  @Field(() => Int)
  Traspasados: number;

  @Column()
  @Field(() => Int)
  SinTraspasar: number;

  @Column()
  @Field(() => Int)
  Inconclusos: number;

  @Column()
  @Field(() => Int)
  Anulados: number;

  @Column({ default: 0 })
  @Field(() => Int)
  Conexion: number;
}
