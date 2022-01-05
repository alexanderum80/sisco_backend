import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Tipo_Usuarios')
export class TipoUsuarios {
  @Field(() => Int)
  @PrimaryColumn()
  IdTipo: number;

  @Field()
  @Column()
  TipoUsuario: string
}
