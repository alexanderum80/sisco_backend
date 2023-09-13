import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Cargos {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id_cargo' })
  IdCargo: number;

  @Field()
  @Column({ name: 'cargo' })
  Cargo: string;
}
