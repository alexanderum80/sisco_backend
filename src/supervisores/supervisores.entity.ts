import { Divisiones } from './../divisiones/divisiones.entity';
import { Cargos } from './../cargos/cargos.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class Supervisor {
    @Field()
    @PrimaryGeneratedColumn()
    IdSupervisor: number;

    @Field()
    @Column()
    Supervisor: string;

    @Field(() => Cargos)
    @ManyToOne(() => Cargos, cargos => cargos.IdCargo)
    @JoinColumn({ name: 'IdCargo', referencedColumnName: 'IdCargo'})
    Cargo: Cargos;

    @Field()
    @ManyToOne(() => Divisiones, divisiones => divisiones.IdDivision)
    @JoinColumn({ name: 'IdDivision', referencedColumnName: 'IdDivision' })
    Division: Divisiones;
}
