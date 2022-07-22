import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class DWHInventario {
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
    @Column({ type: 'decimal', precision: 18, scale: 4 })
    Saldo: number;

    @Field()
    @Column({ type: 'decimal', precision: 18, scale: 4 })
    SaldoDist: number;

    @Field()
    @Column({ type: 'decimal', precision: 18, scale: 4 })
    SaldoRest: number;
}
