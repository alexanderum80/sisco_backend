import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_ComprobarValores')
export class ComprobarValoresEntity {
  @Field()
  @PrimaryGeneratedColumn()
  Id: number;

  @Field()
  @Column()
  IdCentro: number;

  @Field()
  Centro?: string;

  @Field()
  @Column()
  IdExpresion: number;

  @Field()
  Expresion?: string;

  @Field()
  @Column({ length: 3 })
  IdOperador: string;

  @Field()
  Operador?: string;

  @Field()
  @Column()
  Valor: number;

  @Field()
  @Column()
  IdDivision: number;
}
