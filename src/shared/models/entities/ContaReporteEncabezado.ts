import { Column, Entity } from "typeorm";

@Entity("Conta_ReporteEncabezado", { schema: "dbo" })
export class ContaReporteEncabezado {
  @Column("nvarchar", { name: "Periodo", nullable: true, length: 50 })
  periodo: string | null;

  @Column("nvarchar", { name: "Centro", nullable: true })
  centro: string | null;

  @Column("nvarchar", { name: "TipoContabilidad", nullable: true, length: 50 })
  tipoContabilidad: string | null;

  @Column("datetime", {
    name: "FechaActualizacionClasificador",
    nullable: true,
  })
  fechaActualizacionClasificador: Date | null;

  @Column("nchar", { name: "Version", nullable: true, length: 10 })
  version: string | null;

  @Column("nvarchar", { name: "PeriodoAnterior", nullable: true, length: 50 })
  periodoAnterior: string | null;

  @Column("datetime", { name: "FechaImportacion", nullable: true })
  fechaImportacion: Date | null;

  @Column("nvarchar", { name: "CentrosChequeados", nullable: true })
  centrosChequeados: string | null;

  @Column("bit", { name: "Chequea", nullable: true })
  chequea: boolean | null;

  @Column("int", { name: "IdCentro", nullable: true, default: () => "(0)" })
  idCentro: number | null;

  @Column("bit", { name: "Consolidado", nullable: true })
  consolidado: boolean | null;
}
