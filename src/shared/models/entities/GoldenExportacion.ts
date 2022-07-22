import { Column, Entity } from "typeorm";

@Entity("Golden_Exportacion", { schema: "dbo" })
export class GoldenExportacion {
  @Column("nchar", { name: "Tipo", nullable: true, length: 10 })
  tipo: string | null;

  @Column("int", { name: "IdTransacion", nullable: true })
  idTransacion: number | null;

  @Column("int", { name: "IdAlmacenE", nullable: true })
  idAlmacenE: number | null;

  @Column("nchar", { name: "DOCUMEN", nullable: true, length: 10 })
  documen: string | null;

  @Column("nchar", { name: "CUENTA", nullable: true, length: 3 })
  cuenta: string | null;

  @Column("nchar", { name: "SUBCTA", nullable: true, length: 5 })
  subcta: string | null;

  @Column("nchar", { name: "CRIT1", nullable: true, length: 10 })
  crit1: string | null;

  @Column("nchar", { name: "CRIT2", nullable: true, length: 10 })
  crit2: string | null;

  @Column("nchar", { name: "CRIT3", nullable: true, length: 10 })
  crit3: string | null;

  @Column("nvarchar", { name: "VALOR", nullable: true, length: 50 })
  valor: string | null;

  @Column("nchar", { name: "DBCR", nullable: true, length: 2 })
  dbcr: string | null;

  @Column("datetime", { name: "FECOBL", nullable: true })
  fecobl: Date | null;

  @Column("nchar", { name: "DOCOBL", nullable: true, length: 10 })
  docobl: string | null;

  @Column("numeric", { name: "TASA", nullable: true, precision: 18, scale: 2 })
  tasa: number | null;

  @Column("nchar", { name: "MONEDA", nullable: true, length: 3 })
  moneda: string | null;

  @Column("decimal", {
    name: "CONTRATO",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  contrato: number | null;

  @Column("nchar", { name: "IdUnidad", nullable: true, length: 10 })
  idUnidad: string | null;
}
