import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('Conta_ClaseCuenta')
export class ClaseCuentaEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  ID: number;

  @Field()
  @Column()
  IdClase: string;

  @Field()
  @Column()
  IdGrupo: string;

  @Field()
  @Column()
  Clase: string;
}
