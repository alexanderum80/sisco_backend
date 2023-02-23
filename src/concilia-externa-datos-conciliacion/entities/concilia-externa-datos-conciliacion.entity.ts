import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('ConcExt_DatosConciliacion')
export class ConciliaExternaDatosConciliacionEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  IdConciliacion: number;

  @Field(() => Int)
  @Column()
  Annio: number;

  @Field(() => Int)
  @Column()
  Mes: number;

  @Field(() => Boolean)
  @Column({ default: true })
  Abierta: boolean;
}
