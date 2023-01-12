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
  Unidad: number;

  @Field()
  @Column()
  UnidadOD: number;

  @Field({ nullable: true })
  @Column()
  UsuarioEmisor?: number;

  @Field({ nullable: true })
  @Column()
  UsuarioReceptor?: number;

  @Field({ nullable: true })
  @Column()
  UsuarioSupervisor?: number;

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
