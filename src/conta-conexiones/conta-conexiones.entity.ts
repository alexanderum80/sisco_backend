import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'Conta_Conexiones' })
export class ContaConexionesEntity {
    @Field()
    @PrimaryGeneratedColumn()
    Id: number;

    @Field()
    @Column()
    IdUnidad: number;

    @Field()
    Unidad: string;

    @Field()
    @Column()
    Consolidado: boolean;

    @Field()
    @Column()
    IdDivision: number;

    @Field()
    Division: string;

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
