import { ContaOperadoresEntity } from './../conta-operadores/conta-operadores.entity';
import { ExpresionesResumenEntity } from './../conta-expresiones/conta-expresiones.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_ComprobarExpresiones')
export class ContaComprobarExpresionesEntity {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field()
    @Column()
    IdExpresion: number;

    @Field()
    @Column({ length: 3 })
    IdOperador: string;

    @Field()
    @Column()
    IdExpresionC: number;

    @Field()
    @Column()
    Centro: boolean;

    @Field()
    @Column()
    Complejo: boolean;

    @Field()
    @Column()
    Con: boolean;

    @Field()
    @Column()
    Centralizada: boolean;

    @Field()
    @Column()
    IdDivision: number;

    @Field(() => ExpresionesResumenEntity)
    @ManyToOne(() => ExpresionesResumenEntity, expresion => expresion.IdExpresion)
    @JoinColumn({ name: 'IdExpresion', referencedColumnName: 'IdExpresion'})    
    Expresion: ExpresionesResumenEntity;

    @Field(() => ExpresionesResumenEntity)
    @ManyToOne(() => ExpresionesResumenEntity, expresion => expresion.IdExpresion)
    @JoinColumn({ name: 'IdExpresionC', referencedColumnName: 'IdExpresion'})    
    ExpresionC: ExpresionesResumenEntity;

    @Field(() => ContaOperadoresEntity)
    @ManyToOne(() => ContaOperadoresEntity, operador => operador.Id)
    @JoinColumn({ name: 'IdOperador', referencedColumnName: 'Id'})    
    Operador: ContaOperadoresEntity;
}