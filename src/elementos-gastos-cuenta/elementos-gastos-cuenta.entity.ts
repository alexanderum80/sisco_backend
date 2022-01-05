import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ContaEgastocuenta {
    @Field()
    @PrimaryColumn()
    IdEGasto: string;

    @Field()
    @PrimaryColumn()
    Cuenta: string;
}