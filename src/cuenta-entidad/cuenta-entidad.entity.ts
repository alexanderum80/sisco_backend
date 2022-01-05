import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ContaCuentaentidad {
    @Field()
    @PrimaryColumn()
    Cuenta: string;

    @Field()
    @PrimaryColumn()
    SubCuenta: string;

    @Field()
    @PrimaryColumn()
    TipoEntidad: number;

    @Field()
    @PrimaryColumn()
    TipoClasificador: number;
}