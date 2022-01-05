import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_ComprobarExpresiones')
export class ContaComprobarExpresionesEntity {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field()
    @Column()
    Expresion: number;

    @Field()
    @Column({ length: 3 })
    Operador: string;

    @Field()
    @Column()
    ExpresionC: number;

    @Field()
    @Column()
    Centro: boolean;

    @Field()
    @Column()
    Complejo: boolean;

    @Field()
    @Column()
    Con: boolean;

    @Field({ nullable: true })
    ExpresionDesc: string;

    @Field({ nullable: true })
    ExpresionDesc_C: string;

    @Field({ nullable: true })
    OperadorDesc: string;
}