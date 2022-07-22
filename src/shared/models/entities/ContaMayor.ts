import { Column, Entity, Index } from "typeorm";

@Index(
  "Mayor_PK",
  ["centro", "consolidado", "aO", "cuenta", "subCuenta", "perOdo"],
  { unique: true }
)
@Entity("Conta_Mayor", { schema: "dbo" })
export class ContaMayor {
  @Column("int", { primary: true, name: "Centro" })
  centro: number;

  @Column("bit", { primary: true, name: "Consolidado", default: () => "(0)" })
  consolidado: boolean;

  @Column("nvarchar", { primary: true, name: "Año", length: 4 })
  aO: string;

  @Column("nvarchar", { primary: true, name: "Cuenta", length: 8 })
  cuenta: string;

  @Column("nvarchar", { primary: true, name: "SubCuenta", length: 8 })
  subCuenta: string;

  @Column("smallint", { primary: true, name: "Período" })
  perOdo: number;

  @Column("float", {
    name: "Débito",
    nullable: true,
    precision: 53,
    default: () => "(0)",
  })
  dBito: number | null;

  @Column("float", {
    name: "Crédito",
    nullable: true,
    precision: 53,
    default: () => "(0)",
  })
  crDito: number | null;

  @Column("float", {
    name: "Débito Acumulado",
    nullable: true,
    precision: 53,
    default: () => "(0)",
  })
  dBitoAcumulado: number | null;

  @Column("float", {
    name: "Crédito Acumulado",
    nullable: true,
    precision: 53,
    default: () => "(0)",
  })
  crDitoAcumulado: number | null;
}
