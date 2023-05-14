import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('concext_concilia_contabilidad')
export class ConcExtContabilidad {
  @Field()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @Field()
  @Column({ name: 'anno' })
  Anno: string;

  @Field()
  @Column({ name: 'mes' })
  Mes: number;

  @Field()
  @Column({ name: 'cuenta_e' })
  CuentaE: string;

  @Field()
  @Column({ name: 'subcuenta_e' })
  SubCuentaE: string;

  @Field()
  @Column({ name: 'tipo_e' })
  TipoE: string;

  @Field()
  @Column({ name: 'emisor_e' })
  EmisorE: number;

  @Field()
  @Column({ name: 'receptor_e' })
  ReceptorE: number;

  @Field()
  @Column({ name: 'documento_e' })
  DocumentoE: string;

  @Field()
  @Column({ name: 'fecha_e' })
  FechaE: Date;

  @Field()
  @Column({ name: 'valor_e' })
  ValorE: number;

  @Field()
  @Column({ name: 'cuenta_r' })
  CuentaR: string;

  @Field()
  @Column({ name: 'subcuenta_r' })
  SubCuentaR: string;

  @Field()
  @Column({ name: 'tipo_r' })
  TipoR: string;

  @Field()
  @Column({ name: 'emisor_r' })
  EmisorR: number;

  @Field()
  @Column({ name: 'receptor_r' })
  ReceptorR: number;

  @Field()
  @Column({ name: 'documento_r' })
  DocumentoR: string;

  @Field()
  @Column({ name: 'fecha_r' })
  FechaR: Date;

  @Field()
  @Column({ name: 'valor_r' })
  ValorR: number;

  @Field()
  @Column({ name: 'diferencia' })
  Diferencia: number;

  @Field()
  @Column({ name: 'recibido' })
  Recibido: boolean;
}
