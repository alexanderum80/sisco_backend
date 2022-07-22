import { Column, Entity } from "typeorm";

@Entity("Conta_ReporteChequeoCentro", { schema: "dbo" })
export class ContaReporteChequeoCentro {
  @Column("smallint", { name: "Periodo" })
  periodo: number;

  @Column("int", { name: "Centro" })
  centro: number;

  @Column("int", { name: "Unidad" })
  unidad: number;

  @Column("smallint", { name: "IdConsulta" })
  idConsulta: number;

  @Column("nvarchar", { name: "Consulta", length: 150 })
  consulta: string;

  @Column("nvarchar", { name: "Cuenta", nullable: true, length: 8 })
  cuenta: string | null;

  @Column("nvarchar", { name: "SubCuenta", nullable: true, length: 8 })
  subCuenta: string | null;

  @Column("nvarchar", { name: "Análisis 1", nullable: true, length: 20 })
  anLisis_1: string | null;

  @Column("nvarchar", { name: "Análisis 2", nullable: true, length: 20 })
  anLisis_2: string | null;

  @Column("money", { name: "Total", nullable: true })
  total: number | null;

  @Column("nvarchar", { name: "Análisis 3", nullable: true, length: 20 })
  anLisis_3: string | null;

  @Column("bit", { name: "Consolidado", nullable: true })
  consolidado: boolean | null;
}
