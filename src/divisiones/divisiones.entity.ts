import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class DivisionesEntity {
  @Field()
  @PrimaryGeneratedColumn()
  IdDivision: number;

  @Field()
  @Column()
  Division: string;
}
