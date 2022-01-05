import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Unidades {
    @Field()
    @PrimaryColumn()
    IdUnidad: number;

    @Field({ nullable: true })
    @Column()
    Nombre: string;

    @Field({ nullable: true })
    @Column()
    IdComplejo: number;

    @Field({ nullable: true })
    @Column()
    IdSubdivision: number;

    @Field({ nullable: true })
    @Column()
    IdDivision: number;

    @Field({ nullable: true })
    @Column('nchar', { length: 3})
    Provincia: string;

    @Field({ nullable: true })
    @Column()
    Tipo: number;

    @Field({ nullable: true })
    @Column()
    Abierta: boolean;
}