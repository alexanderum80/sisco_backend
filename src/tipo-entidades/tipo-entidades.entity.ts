import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('conta_tipo_entidades')
export class TipoEntidades {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @Field()
  @Column({ name: 'entidades' })
  Entidades: string;

  @Field()
  @Column({ name: 'descripcion' })
  Descripcion: string;
}
