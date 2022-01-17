import { MultipleQueryResponse, SingleQueryResponse } from '../shared/models/query.response.model';
import { Empleado } from './empleados.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmpleadoQueryResponse extends SingleQueryResponse(Empleado) {}

@ObjectType()
export class EmpleadosQueryResponse extends MultipleQueryResponse(Empleado) {}

@InputType()
export class EmpleadoDTO {
    @Field()
    IdEmpleado: number;

    @Field()
    Empleado: string;

    @Field()
    IdCargo: number;

    @Field()
    IdDivision: number;
}