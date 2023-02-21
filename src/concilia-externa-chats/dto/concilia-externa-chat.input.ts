import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConciliaExternaChatInput {
  @Field()
  Usuario: number;

  @Field()
  Mensaje: string;
}
