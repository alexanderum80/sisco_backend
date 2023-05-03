import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity('Divisiones')
export class DivisionesEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id_division' })
  IdDivision: number;

  @Field()
  @Column({ name: 'division' })
  Division: string;
}
