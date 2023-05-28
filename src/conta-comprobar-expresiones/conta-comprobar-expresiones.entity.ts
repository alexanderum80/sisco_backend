import { ContaOperadoresEntity } from './../conta-operadores/conta-operadores.entity';
import { ExpresionesResumenEntity } from './../conta-expresiones/conta-expresiones.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('conta_comprobar_expresiones')
export class ContaComprobarExpresionesEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @Field()
  @Column({ name: 'id_expresion' })
  IdExpresion: number;

  @Field()
  @Column({ name: 'id_operador', length: 3 })
  IdOperador: string;

  @Field()
  @Column({ name: 'id_expresionc' })
  IdExpresionC: number;

  @Field()
  @Column({ name: 'centro' })
  Centro: boolean;

  @Field()
  @Column({ name: 'complejo' })
  Complejo: boolean;

  @Field()
  @Column({ name: 'con' })
  Con: boolean;

  @Field()
  @Column({ name: 'centralizada' })
  Centralizada: boolean;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;

  @Field(() => ExpresionesResumenEntity)
  @ManyToOne(() => ExpresionesResumenEntity, expresion => expresion.IdExpresion)
  @JoinColumn({ name: 'id_expresion', referencedColumnName: 'IdExpresion' })
  Expresion: ExpresionesResumenEntity;

  @Field(() => ExpresionesResumenEntity)
  @ManyToOne(() => ExpresionesResumenEntity, expresion => expresion.IdExpresion)
  @JoinColumn({ name: 'id_expresionc', referencedColumnName: 'IdExpresion' })
  ExpresionC: ExpresionesResumenEntity;

  @Field(() => ContaOperadoresEntity)
  @ManyToOne(() => ContaOperadoresEntity, operador => operador.Id)
  @JoinColumn({ name: 'id_operador', referencedColumnName: 'Id' })
  Operador: ContaOperadoresEntity;
}
