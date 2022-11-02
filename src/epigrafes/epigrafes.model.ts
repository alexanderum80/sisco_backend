import { ContaEpigrafes } from './epigrafes.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class EpigrafesQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [ContaEpigrafes], { nullable: true })
  data?: ContaEpigrafes[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class EpigrafeQueryResponse {
  @Field()
  success: boolean;

  @Field(() => ContaEpigrafes, { nullable: true })
  data?: ContaEpigrafes;

  @Field(() => String, { nullable: true })
  error?: string;
}

@InputType()
export class EpigrafeInput {
  @Field()
  IdEpigafre?: number;

  @Field()
  Epigrafe: string;
}
