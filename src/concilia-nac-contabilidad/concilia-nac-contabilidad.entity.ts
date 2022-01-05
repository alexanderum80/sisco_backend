import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ConcnacContabilidad {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field()
    @Column()
    Annio: string;

    @Field()
    @Column()
    Mes: number;

    @Field()
    @Column()
    CuentaE: string;

    @Field()
    @Column()
    SubCuentaE: string;

    @Field()
    @Column()
    TipoE: string;

    @Field()
    @Column()
    EmisorE: number;

    @Field()
    @Column()
    ReceptorE: number;

    @Field()
    @Column()
    DocumentoE: string;

    @Field()
    @Column()
    FechaE: Date;

    @Field()
    @Column()
    ValorE: number;

    @Field()
    @Column()
    CuentaR: string;

    @Field()
    @Column()
    SubCuentaR: string;

    @Field()
    @Column()
    TipoR: string;

    @Field()
    @Column()
    EmisorR: number;

    @Field()
    @Column()
    ReceptorR: number;

    @Field()
    @Column()
    DocumentoR: string;

    @Field()
    @Column()
    FechaR: Date;

    @Field()
    @Column()
    ValorR: number;

    @Field()
    @Column()
    Diferencia: number;

    @Field()
    @Column()
    Recibido: boolean;
}