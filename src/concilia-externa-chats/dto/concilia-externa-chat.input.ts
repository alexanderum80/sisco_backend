import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConciliaExternaChatInput {
  @Field()
  IdChat: number;

  @Field()
  Usuario: number;

  @Field()
  Mensaje: string;
}
