import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Subdivisiones {
    @Field()
    @PrimaryColumn()
    IdSubdivision: number;

    @Field()
    @Column()
    Subdivision: string;

    @Field()
    @Column()
    IdDivision: number;
}