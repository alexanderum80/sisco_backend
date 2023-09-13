import { DivisionesEntity } from './../divisiones/divisiones.entity';
import { Cargos } from './../cargos/cargos.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('supervisor')
export class Supervisor {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id_supervisor' })
  IdSupervisor: number;

  @Field()
  @Column({ name: 'supervisor' })
  Supervisor: string;

  @Field()
  @Column({ name: 'id_cargo' })
  IdCargo: number;

  @Field(() => Cargos)
  @ManyToOne(() => Cargos, cargos => cargos.IdCargo)
  @JoinColumn({ name: 'id_cargo', referencedColumnName: 'IdCargo' })
  Cargo: Cargos;

  @Field()
  @Column({ name: 'id_division' })
  IdDivision: number;

  @Field(() => DivisionesEntity)
  @ManyToOne(() => DivisionesEntity, divisiones => divisiones.IdDivision)
  @JoinColumn({ name: 'id_division', referencedColumnName: 'IdDivision' })
  Division: DivisionesEntity;
}
