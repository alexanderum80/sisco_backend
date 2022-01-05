import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_TipoValorExpresiones')
export class ContaTipoValorExpresionesEntity {
    @Field()
    @PrimaryColumn()
    IdTipoValor: number;

    @Field()
    @Column()
    Valor: string;
}
