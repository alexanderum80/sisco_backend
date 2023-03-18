import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ContaInformeCtasCobrarPagarView {
  @Field()
  Division: string;

  @Field()
  Organismo: string;

  @Field()
  Grupo: string;

  @Field()
  Cuenta: string;

  @Field()
  ProveedorCliente: string;

  @Field()
  Saldo: number;

  @Field()
  Hasta30: number;

  @Field()
  De30a60: number;

  @Field()
  De60a90: number;

  @Field()
  MasDe90: number;
}
