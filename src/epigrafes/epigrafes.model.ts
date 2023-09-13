import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EpigrafeInput {
  @Field()
  IdEpigrafe?: number;

  @Field()
  Epigrafe: string;
}
