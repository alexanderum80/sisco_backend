import { Column, Entity } from "typeorm";

@Entity("Conta_ReporteExpersiones", { schema: "dbo" })
export class ContaReporteExpersiones {
  @Column("smallint", { name: "Periodo" })
  periodo: number;

  @Column("int", { name: "Centro" })
  centro: number;

  @Column("nvarchar", { name: "Expresion", length: 100 })
  expresion: string;

  @Column("money", { name: "Valor" })
  valor: number;

  @Column("nvarchar", { name: "Operador", length: 5 })
  operador: string;

  @Column("nvarchar", { name: "ExpresionC", length: 100 })
  expresionC: string;

  @Column("money", { name: "ValorC" })
  valorC: number;

  @Column("nvarchar", { name: "Resultado", length: 30 })
  resultado: string;

  @Column("nvarchar", { name: "Tipo", length: 100 })
  tipo: string;

  @Column("bit", { name: "Consolidado", nullable: true })
  consolidado: boolean | null;
}
