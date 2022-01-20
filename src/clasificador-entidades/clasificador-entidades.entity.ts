import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_ClasificarUnidades')
export class ClasificarEntidades {
    @Field()
    @PrimaryColumn()
    IdUnidad: number;

    @Field({ nullable: true })
    Unidad: string

    @Field()
    @Column()
    IdTipoEntidad: number;

    @Field()
    TipoEntidad: string
}