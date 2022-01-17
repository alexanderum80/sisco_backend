import { Divisiones } from './../divisiones/divisiones.entity';
import { Cargos } from './../cargos/cargos.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Empleado {
    @Field()
    @PrimaryGeneratedColumn()
    IdEmpleado: number;

    @Field()
    @Column()
    Empleado: string;

    @Field()
    @Column()
    IdCargo: number;

    @Field(() => Cargos)
    @ManyToOne(() => Cargos, cargos => cargos.IdCargo)
    @JoinColumn({ name: 'IdCargo', referencedColumnName: 'IdCargo' })
    Cargo: Cargos;

    @Field()
    @Column()
    IdDivision: number;

    @Field(() => Divisiones)
    @ManyToOne(() => Divisiones, divisiones => divisiones.IdDivision)
    @JoinColumn({ name: 'IdDivision', referencedColumnName: 'IdDivision'})
    Division: Divisiones;
}
