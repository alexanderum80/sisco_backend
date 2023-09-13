import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('subdivisiones')
export class SubdivisionesEntity {
  @Field()
  @PrimaryColumn({ name: 'id_subdivision' })
  IdSubdivision: number;

  @Field()
  @Column({ name: 'subdivision' })
  Subdivision: string;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;
}
