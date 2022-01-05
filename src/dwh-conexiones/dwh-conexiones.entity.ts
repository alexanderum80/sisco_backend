import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class DWHConexiones {
    @Field()
    @PrimaryColumn()
    IdUnidad: number;

    @Field({ nullable: true })
    @Column()
    ConexionRest?: string;

    @Field({ nullable: true })
    @Column()
    ConexionDWH?: string;

    @Field({ nullable: true })
    @Column()
    ServidorDist?: string;
}