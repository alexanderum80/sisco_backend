import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ContaClasificarunidades {
    @Field()
    @PrimaryColumn()
    IdUnidad: number;

    @Field()
    @Column()
    IdTipoEntidad: number;
}