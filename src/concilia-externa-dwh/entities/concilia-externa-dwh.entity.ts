import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'ConcExt_ConciliaDWH' })
export class ConciliaExternaDWHEntity {
  @Field()
  @PrimaryGeneratedColumn()
  Id: number;

  @Field()
  @Column()
  Annio: string;

  @Field()
  @Column()
  Mes: number;

  @Field()
  @Column()
  Emisor: number;

  @Field()
  @Column()
  FechaEmision: Date;

  @Field()
  @Column()
  Receptor: number;

  @Field()
  @Column()
  FechaRecepcion: Date;

  @Field()
  @Column()
  Documento: string;

  @Field()
  @Column()
  ImpEmisor: number;

  @Field()
  @Column()
  ImpReceptor: number;

  @Field()
  @Column()
  Diferencia: number;

  @Field()
  @Column()
  Recibido: boolean;
}
