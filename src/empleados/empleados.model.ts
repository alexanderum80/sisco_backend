import { Empleado } from './empleados.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VEmpleados {
    @Field()
    IdEmpleado: number;

    @Field()
    Empleado: string;

    @Field()
    Cargo: string;

    @Field()
    IdDivision: number;

    @Field()
    Division: string;
}

@ObjectType()
export class EmpleadosQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [Empleado], { nullable: true })
    data?: Empleado[];

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class EmpleadoQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => Empleado, { nullable: true })
    data?: Empleado;

    @Field(type => String, { nullable: true })
    error?: String;
}

@InputType()
export class EmpleadoInput {
    @Field()
    IdEmpleado: number;

    @Field()
    Empleado: string;

    @Field()
    IdCargo: number;

    @Field()
    IdDivision: number;
}