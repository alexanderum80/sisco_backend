import { Almacenes } from './almacenes.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AlmacenesQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [Almacenes], { nullable: true })
    data?: Almacenes[];

    @Field(type => String, { nullable: true })
    error?: String;
}