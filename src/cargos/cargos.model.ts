import { Cargos } from './cargos.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CargosQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => [Cargos], { nullable: true })
    data?: Cargos[];

    @Field(type => String, { nullable: true })
    error?: String;
}