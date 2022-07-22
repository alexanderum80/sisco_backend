import { Column, Entity, Index } from 'typeorm';

@Index('PK_UtilesProducto', ['idCentro', 'idUnidad', 'codigProducto'], {
  unique: true,
})
@Entity('Utiles_Producto', { schema: 'dbo' })
export class UtilesProducto {
  @Column('int', { primary: true, name: 'IdCentro' })
  idCentro: number;

  @Column('int', { primary: true, name: 'IdUnidad' })
  idUnidad: number;

  @Column('varchar', { primary: true, name: 'Codig_PRODUCTO', length: 27 })
  codigProducto: string;

  @Column('varchar', { name: 'DESCRIP_PRODUCTO', length: 50 })
  descripProducto: string;

  @Column('varchar', { name: 'UM', length: 5 })
  um: string;

  @Column('tinyint', { name: 'Per_Propuesto', nullable: true })
  perPropuesto: number | null;

  @Column('varchar', { name: 'Per_Chequeado', nullable: true, length: 36 })
  perChequeado: string | null;

  @Column('varchar', { name: 'CodCategoria', nullable: true, length: 2 })
  codCategoria: string | null;
}
