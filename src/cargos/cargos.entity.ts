import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Cargos {
    @Field()
    @PrimaryGeneratedColumn()
    IdCargo: number;

    @Field()
    @Column()
    Cargo: string;
}
