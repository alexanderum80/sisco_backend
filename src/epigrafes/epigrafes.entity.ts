import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ContaEpigrafes {
    @Field()
    @PrimaryGeneratedColumn()
    IdEpigafre: number;

    @Field()
    @Column()
    Epigrafe: string;
}