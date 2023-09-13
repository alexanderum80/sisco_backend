import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('conta_no_usar_en_cta')
export class ContaNoUsarEnCuentaEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @Field({ nullable: true })
  @Column({ name: 'codigo', length: 3, nullable: true })
  Codigo: string;

  @Field({ nullable: true })
  @Column({ name: 'cta', length: 8, nullable: true })
  Cta: string;

  @Field({ nullable: true })
  @Column({ name: 'subcta', length: 8, nullable: true })
  SubCta: string;

  @Field({ nullable: true })
  @Column({ name: 'crit1', length: 10, nullable: true })
  Crit1: string;

  @Field({ nullable: true })
  @Column({ name: 'crit2', length: 10, nullable: true })
  Crit2: string;

  @Field({ nullable: true })
  @Column({ name: 'crit3', length: 10, nullable: true })
  Crit3: string;

  @Field({ nullable: true })
  @Column({ name: 'crit4', length: 10, nullable: true })
  Crit4: string;

  @Field({ nullable: true })
  @Column({ name: 'crit5', length: 10, nullable: true })
  Crit5: string;

  @Field()
  @Column({ name: 'centralizada' })
  Centralizada: boolean;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;
}
