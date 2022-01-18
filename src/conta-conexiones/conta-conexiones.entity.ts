import { Divisiones } from './../divisiones/divisiones.entity';
import { CentrosView } from './../unidades/unidades.entity';
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
    Unidad: CentrosView;

    @Field()
    @Column()
    Consolidado: boolean;

    @Field()
    @Column()
    IdDivision: number;

    @Field(() => Divisiones)
    @ManyToOne(() => Divisiones, divisiones => divisiones.IdDivision)
    @JoinColumn({ name: 'IdDivision', referencedColumnName: 'IdDivision'})
    Division: Divisiones;

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
