import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('tipo_usuarios')
export class TipoUsuarios {
  @Field(() => Int)
  @PrimaryColumn({ name: 'id_tipo' })
  IdTipo: number;

  @Field()
  @Column({ name: 'tipo_usuario' })
  TipoUsuario: string;
}
