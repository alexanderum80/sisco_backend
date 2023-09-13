import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('concext_datos_conciliacion')
export class ConciliaExternaDatosConciliacionEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'id_conciliacion' })
  IdConciliacion: number;

  @Field(() => Int)
  @Column({ name: 'anno' })
  Annio: number;

  @Field(() => Int)
  @Column({ name: 'mes' })
  Mes: number;

  @Field(() => Boolean)
  @Column({ name: 'abierta', default: true })
  Abierta: boolean;
}
