import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class RodasVentas {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field()
    @Column()
    IdCentro: number;

    @Field()
    @Column()
    IdUnidad: number;

    @Field()
    @Column()
    IdPiso: number;

    @Field()
    @Column()
    Periodo: number;

    @Field()
    @Column()
    Cuenta: string;

    @Field()
    @Column()
    SubCuenta: string;

    @Field()
    @Column()
    Crt1: string;

    @Field()
    @Column()
    Crt2: string;

    @Field()
    @Column()
    Crt3: string;

    @Field()
    @Column({ type: 'decimal', precision: 18, scale: 4 })
    Saldo: number;

}