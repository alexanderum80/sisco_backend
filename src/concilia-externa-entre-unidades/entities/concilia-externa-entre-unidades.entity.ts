import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('ConcExt_ConciliaEntreUnidades')
export class ConciliaExternaEntreUnidadesEntity {
  @Field()
  @PrimaryGeneratedColumn()
  ID: number;

  @Field()
  @Column()
  Annio: number;

  @Field()
  @Column()
  Mes: number;

  @Field()
  @Column()
  IdUnidad: number;

  @Field()
  @Column()
  IdUnidadOD: number;

  @Field({ nullable: true })
  @Column()
  IdUsuarioEmisor?: number;

  @Field({ nullable: true })
  @Column()
  IdUsuarioReceptor?: number;

  @Field({ nullable: true })
  @Column()
  IdUsuarioSupervisor?: number;

  @Field({ nullable: true })
  @Column()
  Nota?: string;
}

@ObjectType()
export class ConciliaExternaCentrosNoConciliados {
  @Field()
  Emisor: string;

  @Field()
  Receptor: string;
}
