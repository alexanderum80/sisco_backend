import { Column, Entity } from "typeorm";

@Entity("Comprobantes", { schema: "dbo" })
export class Comprobantes {
  @Column("nvarchar", { name: "COMP", nullable: true, length: 5 })
  comp: string | null;

  @Column("nvarchar", { name: "DOCUMEN", nullable: true, length: 10 })
  documen: string | null;

  @Column("nvarchar", { name: "CUENTA", nullable: true, length: 3 })
  cuenta: string | null;

  @Column("nvarchar", { name: "SUBCTA", nullable: true, length: 10 })
  subcta: string | null;

  @Column("nvarchar", { name: "CRIT1", nullable: true, length: 10 })
  crit1: string | null;

  @Column("nvarchar", { name: "CRIT2", nullable: true, length: 10 })
  crit2: string | null;

  @Column("nvarchar", { name: "CRIT3", nullable: true, length: 10 })
  crit3: string | null;

  @Column("float", { name: "VALOR", nullable: true, precision: 53 })
  valor: number | null;

  @Column("nvarchar", { name: "DBCR", nullable: true, length: 2 })
  dbcr: string | null;

  @Column("datetime", { name: "FECOBL", nullable: true })
  fecobl: Date | null;

  @Column("nvarchar", { name: "DOCOBL", nullable: true, length: 10 })
  docobl: string | null;

  @Column("nvarchar", { name: "MONEDA", nullable: true, length: 3 })
  moneda: string | null;

  @Column("float", { name: "TASA", nullable: true, precision: 53 })
  tasa: number | null;

  @Column("float", { name: "CONTRATO", nullable: true, precision: 53 })
  contrato: number | null;

  @Column("nvarchar", { name: "CONCECON", nullable: true, length: 3 })
  concecon: string | null;

  @Column("nvarchar", { name: "ANALCONC", nullable: true, length: 10 })
  analconc: string | null;

  @Column("nvarchar", { name: "TIPODIAR", nullable: true, length: 2 })
  tipodiar: string | null;

  @Column("nchar", { name: "IdGerencia", nullable: true, length: 3 })
  idGerencia: string | null;

  @Column("nchar", { name: "IdAlmacen", nullable: true, length: 3 })
  idAlmacen: string | null;

  @Column("nchar", { name: "IdTransaccion", nullable: true, length: 2 })
  idTransaccion: string | null;
}
