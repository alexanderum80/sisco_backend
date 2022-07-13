import { ContaEpigrafes } from './epigrafes.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class EpigrafesQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => [ContaEpigrafes], { nullable: true })
    data?: ContaEpigrafes[];

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class EpigrafeQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => ContaEpigrafes, { nullable: true })
    data?: ContaEpigrafes;

    @Field(() => String, { nullable: true })
    error?: String;
}

@InputType()
export class EpigrafeInput {
    @Field()
    IdEpigafre?: number;

    @Field()
    Epigrafe: string;
}

