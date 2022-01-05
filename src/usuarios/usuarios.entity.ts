import { Divisiones } from './../divisiones/divisiones.entity';
import { TipoUsuarios } from './../tipo-usuarios/tipo-usuarios.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Usuarios {
    @Field()
    @PrimaryGeneratedColumn()
    IdUsuario: number;

    @Field()
    @Column()
    Usuario: string;

    @Field()
    @Column()
    Contrasena?: string;

    @Field()
    @Column()
    IdTipoUsuario: number;

    @Field(() => TipoUsuarios)
    @ManyToOne(() => TipoUsuarios, tipoUsuarios => tipoUsuarios.IdTipo)
    @JoinColumn({ name: 'IdTipoUsuario', referencedColumnName: 'IdTipo'})
    TipoUsuario?: TipoUsuarios;

    @Field()
    @Column()
    CambiarContrasena: boolean;

    @Field()
    @Column()
    IdDivision: number;
    
    @Field(() => Divisiones)
    @ManyToOne(() => Divisiones, divisiones => divisiones.IdDivision)
    @JoinColumn({ name: 'IdDivision', referencedColumnName: 'IdDivision'})
    Division?: Divisiones;

    @Field()
    Token: string;
}