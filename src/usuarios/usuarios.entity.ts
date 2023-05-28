import { DivisionesEntity } from './../divisiones/divisiones.entity';
import { TipoUsuarios } from './../tipo-usuarios/tipo-usuarios.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@ObjectType()
@Entity('usuarios')
export class UsuariosEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  IdUsuario: number;

  @Field()
  @Column({ name: 'usuario' })
  Usuario: string;

  @Field()
  @Column({ name: 'contrasena' })
  Contrasena?: string;

  @Field()
  @Column({ name: 'id_tipo_usuario' })
  IdTipoUsuario: number;

  @Field(() => TipoUsuarios)
  @ManyToOne(() => TipoUsuarios, tipoUsuarios => tipoUsuarios.IdTipo)
  @JoinColumn({ name: 'id_tipo_usuario', referencedColumnName: 'IdTipo' })
  TipoUsuario?: TipoUsuarios;

  @Field()
  @Column({ name: 'cambiar_contrasena' })
  CambiarContrasena: boolean;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;

  @Field(() => DivisionesEntity)
  @ManyToOne(() => DivisionesEntity, divisiones => divisiones.IdDivision)
  @JoinColumn({ name: 'id_division', referencedColumnName: 'IdDivision' })
  Division?: DivisionesEntity;

  @Field()
  Token: string;

  @Field()
  RefreshToken: string;
}
