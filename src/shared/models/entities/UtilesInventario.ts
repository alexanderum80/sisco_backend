import { Column, Entity, Index } from 'typeorm';

@Index('PK_UtilesInventario', ['idCentro', 'idUnidad', 'periodo', 'codigProducto', 'codigTrabajador', 'codigArea'], { unique: true })
@Entity('Utiles_Inventario', { schema: 'dbo' })
export class UtilesInventario {
  @Column('int', { primary: true, name: 'IdCentro' })
  idCentro: number;

  @Column('int', { primary: true, name: 'IdUnidad' })
  idUnidad: number;

  @Column('int', { primary: true, name: 'Periodo' })
  periodo: number;

  @Column('varchar', { primary: true, name: 'Codig_Producto', length: 27 })
  codigProducto: string;

  @Column('varchar', { primary: true, name: 'Codig_Trabajador', length: 20 })
  codigTrabajador: string;

  @Column('varchar', { primary: true, name: 'Codig_Area', length: 20 })
  codigArea: string;

  @Column('smallint', { name: 'Existencia', nullable: true })
  existencia: number | null;

  @Column('numeric', {
    name: 'Importe_MN_p',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  importeMnP: number | null;

  @Column('numeric', {
    name: 'Importe_MLC_p',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  importeMlcP: number | null;

  @Column('numeric', {
    name: 'Depreciacion_MN_p',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  depreciacionMnP: number | null;

  @Column('numeric', {
    name: 'Depreciacion_MLC_p',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  depreciacionMlcP: number | null;

  @Column('numeric', {
    name: 'Importe',
    nullable: true,
    precision: 19,
    scale: 2,
  })
  importe: number | null;
}
