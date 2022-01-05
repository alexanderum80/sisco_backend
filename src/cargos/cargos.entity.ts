import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
