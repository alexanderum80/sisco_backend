import { Column, Entity } from "typeorm";

@Entity("AsientoResumido", { schema: "dbo" })
export class AsientoResumido {
  @Column("nchar", { name: "Cuenta", nullable: true, length: 10 })
  cuenta: string | null;

  @Column("nchar", { name: "SubCuenta", nullable: true, length: 10 })
  subCuenta: string | null;

  @Column("nchar", { name: "Análisis 1", nullable: true, length: 10 })
  anLisis_1: string | null;

  @Column("nchar", { name: "Análisis 2", nullable: true, length: 10 })
  anLisis_2: string | null;

  @Column("nchar", { name: "Análisis 3", nullable: true, length: 10 })
  anLisis_3: string | null;

  @Column("nchar", { name: "DBCR", nullable: true, length: 2 })
  dbcr: string | null;

  @Column("decimal", { name: "Valor", nullable: true, precision: 18, scale: 2 })
  valor: number | null;

  @Column("int", { name: "Período", nullable: true })
  perOdo: number | null;
}
