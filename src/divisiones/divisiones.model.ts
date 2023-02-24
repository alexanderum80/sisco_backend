import { DivisionesEntity } from './divisiones.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DivisionesQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [DivisionesEntity], { nullable: true })
  data?: DivisionesEntity[];

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class DivisionQueryResponse {
  @Field()
  success: boolean;

  @Field(() => DivisionesEntity, { nullable: true })
  data?: DivisionesEntity;

  @Field(() => String, { nullable: true })
  error?: string;
}
