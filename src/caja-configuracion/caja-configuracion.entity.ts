import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CajaConfiguracionEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  IdCaja: number;

  @Field()
  @Column()
  IP: string;

  @Field()
  @Column()
  SN: string;

  @Field(() => Int)
  @Column()
  IdUnidad: number;
}
