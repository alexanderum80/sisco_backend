import { CentrosView } from './../unidades/unidades.entity';
import { DivisionesEntity } from './../divisiones/divisiones.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'Conta_Conexiones' })
export class ContaConexionesEntity {
  @Field()
  @PrimaryGeneratedColumn()
  Id: number;

  @Field()
  @Column()
  IdUnidad: number;

  @Field(() => CentrosView)
  @ManyToOne(() => CentrosView, centros => centros.IdUnidad)
  @JoinColumn({ name: 'IdUnidad', referencedColumnName: 'IdUnidad' })
  Unidad: CentrosView;

  @Field()
  @Column()
  Consolidado: boolean;

  @Field()
  @Column()
  IdDivision: number;

  @Field(() => DivisionesEntity)
  @ManyToOne(() => DivisionesEntity, divisiones => divisiones.IdDivision)
  @JoinColumn({ name: 'IdDivision', referencedColumnName: 'IdDivision' })
  Division: DivisionesEntity;

  @Field({ nullable: true })
  @Column()
  IpRodas: string;

  @Field({ nullable: true })
  @Column()
  BaseDatos: string;
}
