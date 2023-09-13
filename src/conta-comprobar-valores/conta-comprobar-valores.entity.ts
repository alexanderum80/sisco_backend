import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('conta_comprobar_valores')
export class ComprobarValoresEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @Field()
  @Column({ name: 'id_centro' })
  IdCentro: number;

  @Field()
  Centro?: string;

  @Field()
  @Column({ name: 'id_expresion' })
  IdExpresion: number;

  @Field()
  Expresion?: string;

  @Field()
  @Column({ name: 'id_operador', length: 3 })
  IdOperador: string;

  @Field()
  Operador?: string;

  @Field()
  @Column('double precision', { name: 'valor' })
  Valor: number;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;

  @Field()
  @Column('bit', { name: 'consolidado' })
  Consolidado: boolean;

  @Field()
  @Column('bit', { name: 'activo' })
  Activo: boolean;
}
