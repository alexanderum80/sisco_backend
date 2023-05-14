import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('conta_epigrafes')
export class ContaEpigrafesEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id_epigrafe' })
  IdEpigrafe: number;

  @Field()
  @Column({ name: 'epigrafe' })
  Epigrafe: string;
}
