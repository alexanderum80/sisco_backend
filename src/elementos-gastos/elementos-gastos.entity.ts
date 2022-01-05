import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Conta_Egastos')
export class ContaElementosGastos {
    @Field()
    @PrimaryColumn()
    Egasto: string;

    @Field()
    @Column()
    Descripcion: string;

    @Field()
    @Column()
    UsoContenido: string;

    @Field()
    @Column()
    TipoEntidad: string;

    @Field()
    @Column()
    CuentaAsociada: string;

    @Field()
    @Column()
    IdEpigrafe: number;
}