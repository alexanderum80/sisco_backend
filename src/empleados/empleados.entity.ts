import { DivisionesEntity } from './../divisiones/divisiones.entity';
import { Cargos } from './../cargos/cargos.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('empleado')
export class Empleado {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id_empleado' })
  IdEmpleado: number;

  @Field()
  @Column({ name: 'empleado' })
  Empleado: string;

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
