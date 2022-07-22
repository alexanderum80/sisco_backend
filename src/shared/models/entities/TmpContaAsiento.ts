import { Column, Entity, Index } from "typeorm";

@Index("PK_tmpContaAsiento", ["centro", "consolidado", "aO", "asiento"], {
  unique: true,
})
@Entity("tmpConta_Asiento", { schema: "dbo" })
export class TmpContaAsiento {
  @Column("nvarchar", { primary: true, name: "Centro", length: 3 })
  centro: string;

  @Column("bit", { primary: true, name: "Consolidado", default: () => "(0)" })
  consolidado: boolean;

  @Column("nvarchar", { primary: true, name: "Año", length: 4 })
  aO: string;

  @Column("nchar", { name: "Tipo de Comprobante", nullable: true, length: 3 })
  tipoDeComprobante: string | null;

  @Column("nchar", { name: "Número de Comprobante", nullable: true, length: 5 })
  nMeroDeComprobante: string | null;

  @Column("nvarchar", {
    name: "Número de Documento",
    nullable: true,
    length: 10,
  })
  nMeroDeDocumento: string | null;

  @Column("smallint", { name: "Período", nullable: true })
  perOdo: number | null;

  @Column("int", { primary: true, name: "Asiento" })
  asiento: number;

  @Column("nchar", { name: "Tipo de Asiento", nullable: true, length: 3 })
  tipoDeAsiento: string | null;

  @Column("nvarchar", { name: "Cuenta", nullable: true, length: 8 })
  cuenta: string | null;

  @Column("nvarchar", { name: "SubCuenta", nullable: true, length: 8 })
  subCuenta: string | null;

  @Column("nchar", { name: "Tipo de Análisis 1", nullable: true, length: 1 })
  tipoDeAnLisis_1: string | null;

  @Column("nvarchar", { name: "Análisis 1", nullable: true, length: 20 })
  anLisis_1: string | null;

  @Column("nchar", { name: "Tipo de Análisis 2", nullable: true, length: 1 })
  tipoDeAnLisis_2: string | null;

  @Column("nvarchar", { name: "Análisis 2", nullable: true, length: 20 })
  anLisis_2: string | null;

  @Column("nchar", { name: "Tipo de Análisis 3", nullable: true, length: 1 })
  tipoDeAnLisis_3: string | null;

  @Column("nvarchar", { name: "Análisis 3", nullable: true, length: 20 })
  anLisis_3: string | null;

  @Column("nvarchar", { name: "Detalle", nullable: true, length: 20 })
  detalle: string | null;

  @Column("nchar", { name: "Naturaleza", nullable: true, length: 1 })
  naturaleza: string | null;

  @Column("float", { name: "Débito", nullable: true, precision: 53 })
  dBito: number | null;

  @Column("float", { name: "Crédito", nullable: true, precision: 53 })
  crDito: number | null;

  @Column("bit", { name: "Moneda Extranjera", nullable: true })
  monedaExtranjera: boolean | null;

  @Column("nchar", { name: "Tipo de Moneda", nullable: true, length: 3 })
  tipoDeMoneda: string | null;

  @Column("float", { name: "Tasa", nullable: true, precision: 53 })
  tasa: number | null;

  @Column("nchar", { name: "Estado", nullable: true, length: 1 })
  estado: string | null;

  @Column("nvarchar", {
    name: "Documento de Obligación",
    nullable: true,
    length: 10,
  })
  documentoDeObligaciN: string | null;

  @Column("datetime", { name: "Fecha", nullable: true })
  fecha: Date | null;

  @Column("float", { name: "Saldo", nullable: true, precision: 53 })
  saldo: number | null;
}
