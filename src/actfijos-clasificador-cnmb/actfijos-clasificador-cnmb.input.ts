import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class ActFijosClasificadorCnmbInput {
    @Field()
    CNMB: string;

    @Field()
    DCNMB: string;

    @Field(() => Float)
    TREPO: number;
}
