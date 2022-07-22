import { Column, Entity } from "typeorm";

@Entity("Golden_SubmayorVsInventario", { schema: "dbo" })
export class GoldenSubmayorVsInventario {
  @Column("int", { name: "IdCentro", nullable: true })
  idCentro: number | null;

  @Column("int", { name: "IdUnidad", nullable: true })
  idUnidad: number | null;

  @Column("int", { name: "Periodo", nullable: true })
  periodo: number | null;

  @Column("int", { name: "IdPiso", nullable: true })
  idPiso: number | null;

  @Column("nvarchar", { name: "Codigo", nullable: true, length: 13 })
  codigo: string | null;

  @Column("nvarchar", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("decimal", {
    name: "ImpSubmayor",
    nullable: true,
    precision: 18,
    scale: 4,
  })
  impSubmayor: number | null;

  @Column("decimal", {
    name: "ImpInventario",
    nullable: true,
    precision: 18,
    scale: 4,
  })
  impInventario: number | null;
}
