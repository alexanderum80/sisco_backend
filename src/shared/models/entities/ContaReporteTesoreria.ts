import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__ResultTesoreria", ["id"], { unique: true })
@Entity("Conta_ReporteTesoreria", { schema: "dbo" })
export class ContaReporteTesoreria {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "Centro" })
  centro: number;

  @Column("money", { name: "Total" })
  total: number;

  @Column("nvarchar", { name: "Consulta" })
  consulta: string;

  @Column("bit", { name: "Consolidado", nullable: true })
  consolidado: boolean | null;
}
