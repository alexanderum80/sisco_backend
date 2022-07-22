import { Column, Entity } from "typeorm";

@Entity("Conta_ReporteValor", { schema: "dbo" })
export class ContaReporteValor {
  @Column("int", { name: "Periodo", nullable: true })
  periodo: number | null;

  @Column("int", { name: "Centro", nullable: true })
  centro: number | null;

  @Column("nvarchar", { name: "Expresion", nullable: true, length: 255 })
  expresion: string | null;

  @Column("decimal", { name: "Valor", nullable: true, precision: 18, scale: 2 })
  valor: number | null;

  @Column("nchar", { name: "Operador", nullable: true, length: 2 })
  operador: string | null;

  @Column("decimal", {
    name: "ValorRodas",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  valorRodas: number | null;

  @Column("nchar", { name: "Estado", nullable: true, length: 10 })
  estado: string | null;

  @Column("bit", { name: "Consolidado", nullable: true })
  consolidado: boolean | null;

  @Column("int", { name: "IdDivision", nullable: true })
  idDivision: number | null;
}
