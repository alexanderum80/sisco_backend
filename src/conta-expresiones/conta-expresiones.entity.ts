import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_ExpresionesResumen')
export class ExpresionesResumenEntity {
    @Field()
    @PrimaryGeneratedColumn()
    IdExpresion: number;

    @Field()
    @Column()
    Expresion: string;

    @Field({ nullable: true })
    @Column()
    Descripcion: string;

    @Field()
    @Column()
    Acumulado: boolean;

    @Field()
    @Column()
    OperacionesInternas: boolean;

    @Field()
    @Column()
    Centralizada: boolean;
    
    @Field()
    @Column()
    IdDivision: number;
}

@ObjectType()
@Entity('Conta_ExpresionesDetalle')
export class ExpresionesDetalleEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    IdExpresion: number;

    @Field({ nullable: true })
    @Column({ type: 'nvarchar', length: 3 })
    Centro: string;

    @Field({ nullable: true })
    @Column({ type: 'nvarchar', length: 8 })
    Cta: string;

    @Field({ nullable: true })
    @Column({ type: 'nvarchar', length: 8 })
    SubCta: string;

    @Field({ nullable: true })
    @Column({ type: 'nvarchar', length: 10 })
    Crit1: string;

    @Field({ nullable: true })
    @Column({ type: 'nvarchar', length: 10 })
    Crit2: string;

    @Field({ nullable: true })
    @Column({ type: 'nvarchar', length: 10 })
    Crit3: string;

    @Field()
    @Column({ type: 'nvarchar', length: 1 })
    Signo: string;

    @Field()
    @Column()
    PorCiento: number;

    @Field()
    @Column()
    TipoValor: number;
}