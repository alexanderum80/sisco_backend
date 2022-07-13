import { Almacenes } from './almacenes.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AlmacenesQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [Almacenes], { nullable: true })
    data?: Almacenes[];

    @Field(() => String, { nullable: true })
    error?: String;
}