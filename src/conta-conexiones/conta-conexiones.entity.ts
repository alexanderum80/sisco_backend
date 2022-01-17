import { Divisiones } from './../divisiones/divisiones.entity';
import { Unidades } from './../unidades/unidades.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, ViewEntity, ViewColumn, Connection } from 'typeorm';

@ObjectType()
@Entity()
export class ContaConexiones {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field()
    @Column()
    IdUnidad: number;

    @Field()
    @Column()
    Consolidado: boolean;

    @Field()
    @Column()
    IdDivision: number;

    @Field({ nullable: true })
    @Column()
    IpRodas: string;

    @Field({ nullable: true })
    @Column()
    Usuario: string;

    @Field({ nullable: true })
    @Column()
    Contrasena: string;

    @Field({ nullable: true })
    @Column()
    BaseDatos: string;
}

@ObjectType()
@ViewEntity('vConta_Conexiones')
export class ContaConexionesView {
    @Field()
    @ViewColumn()
    Id: number;

    @Field()
    @ViewColumn()
    IdUnidad: number;

    @Field()
    @ViewColumn()
    Unidad: string;

    @Field()
    @ViewColumn()
    Consolidado: boolean;

    @Field()
    @ViewColumn()
    IdDivision: number;

    @Field()
    @ViewColumn()
    Division: string;

    @Field({ nullable: true })
    @ViewColumn()
    IpRodas: string;

    @Field({ nullable: true })
    @ViewColumn()
    Usuario: string;

    @Field({ nullable: true })
    @ViewColumn()
    BaseDatos: string;
}