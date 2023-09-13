import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ContaInformeCtasCobrarPagarView {
  @Field({ name: 'Division' })
  division: string;

  @Field({ name: 'Organismo' })
  organismo: string;

  @Field({ name: 'Grupo' })
  grupo: string;

  @Field({ name: 'Cuenta' })
  cuenta: string;

  @Field({ name: 'ProveedorCliente', nullable: true })
  proveedor_cliente?: string;

  @Field({ name: 'Saldo' })
  saldo: number;

  @Field({ name: 'Hasta30' })
  hasta30: number;

  @Field({ name: 'De30a60' })
  de30a60: number;

  @Field({ name: 'De60a90' })
  de60a90: number;

  @Field({ name: 'MasDe90' })
  mas90: number;
}
