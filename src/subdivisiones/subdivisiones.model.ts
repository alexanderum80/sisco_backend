import { SubdivisionesEntity } from './subdivisiones.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SubdivisionesQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [SubdivisionesEntity], { nullable: true })
  data?: SubdivisionesEntity[];

  @Field({ nullable: true })
  error?: string;
}
