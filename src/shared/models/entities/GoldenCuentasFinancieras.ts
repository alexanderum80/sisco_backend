import { Column, Entity } from "typeorm";

@Entity("Golden_CuentasFinancieras", { schema: "dbo" })
export class GoldenCuentasFinancieras {
  @Column("nvarchar", {
    name: "IdCuentaFinanciera",
    nullable: true,
    length: 10,
  })
  idCuentaFinanciera: string | null;

  @Column("nvarchar", { name: "Titular", length: 250 })
  titular: string;

  @Column("nvarchar", { name: "Empresa", nullable: true, length: 25 })
  empresa: string | null;

  @Column("nvarchar", { name: "Direccion", nullable: true, length: 50 })
  direccion: string | null;

  @Column("nvarchar", { name: "Telefono", nullable: true, length: 15 })
  telefono: string | null;

  @Column("nvarchar", { name: "Fax", nullable: true, length: 50 })
  fax: string | null;

  @Column("nvarchar", { name: "BBS", nullable: true, length: 50 })
  bbs: string | null;

  @Column("image", { name: "Logo", nullable: true })
  logo: Buffer | null;

  @Column("bit", { name: "Interno" })
  interno: boolean;

  @Column("bit", { name: "InternoDivision" })
  internoDivision: boolean;

  @Column("bit", { name: "DelOrganismo" })
  delOrganismo: boolean;

  @Column("nvarchar", { name: "ONE", nullable: true, length: 50 })
  one: string | null;

  @Column("nvarchar", { name: "NIT", nullable: true, length: 50 })
  nit: string | null;

  @Column("nvarchar", { name: "NIRCC", nullable: true, length: 50 })
  nircc: string | null;

  @Column("nvarchar", { name: "CuentaCUC", nullable: true, length: 100 })
  cuentaCuc: string | null;

  @Column("nvarchar", { name: "CuentaMN", nullable: true, length: 100 })
  cuentaMn: string | null;

  @Column("bit", { name: "Proveedor" })
  proveedor: boolean;

  @Column("bit", { name: "Cliente" })
  cliente: boolean;

  @Column("bit", { name: "Conflicto" })
  conflicto: boolean;

  @Column("nvarchar", { name: "Nota", nullable: true })
  nota: string | null;

  @Column("float", { name: "Descuento", nullable: true, precision: 53 })
  descuento: number | null;

  @Column("bit", { name: "Activo" })
  activo: boolean;

  @Column("bit", { name: "Nacional" })
  nacional: boolean;

  @Column("bit", { name: "Importadora" })
  importadora: boolean;

  @Column("nvarchar", { name: "PrecioModulo", nullable: true, length: 50 })
  precioModulo: string | null;

  @Column("tinyint", { name: "CompMNCostoBase", nullable: true })
  compMnCostoBase: number | null;

  @Column("float", { name: "IndiceMN", nullable: true, precision: 53 })
  indiceMn: number | null;

  @Column("bit", { name: "IncluirSegFletAranc" })
  incluirSegFletAranc: boolean;

  @Column("nvarchar", { name: "PrecioTercero", nullable: true, length: 50 })
  precioTercero: string | null;

  @Column("nvarchar", { name: "PrecioTerceroMN", nullable: true, length: 50 })
  precioTerceroMn: string | null;

  @Column("bit", { name: "Local" })
  local: boolean;

  @Column("float", { name: "IndiceTercero", nullable: true, precision: 53 })
  indiceTercero: number | null;

  @Column("float", { name: "IndiceTerceroMN", nullable: true, precision: 53 })
  indiceTerceroMn: number | null;

  @Column("bit", { name: "InternoComplejo" })
  internoComplejo: boolean;
}
