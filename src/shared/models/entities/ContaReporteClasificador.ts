import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Conta_ReporteClasificador", ["id"], { unique: true })
@Entity("Conta_ReporteClasificador", { schema: "dbo" })
export class ContaReporteClasificador {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "Centro" })
  centro: number;

  @Column("bit", { name: "Consolidado" })
  consolidado: boolean;

  @Column("nchar", { name: "Cta", length: 8 })
  cta: string;

  @Column("nchar", { name: "SubCta", length: 8 })
  subCta: string;

  @Column("nvarchar", { name: "Descripcion", nullable: true, length: 255 })
  descripcion: string | null;

  @Column("nchar", { name: "Crt1Calsif", nullable: true, length: 8 })
  crt1Calsif: string | null;

  @Column("nchar", { name: "Crt2Calsif", nullable: true, length: 8 })
  crt2Calsif: string | null;

  @Column("nchar", { name: "Crt3Calsif", nullable: true, length: 8 })
  crt3Calsif: string | null;

  @Column("nchar", { name: "Crt1Rodas", nullable: true, length: 8 })
  crt1Rodas: string | null;

  @Column("nchar", { name: "Crt2Rodas", nullable: true, length: 8 })
  crt2Rodas: string | null;

  @Column("nchar", { name: "Crt3Rodas", nullable: true, length: 8 })
  crt3Rodas: string | null;

  @Column("char", { name: "NatClasif", nullable: true, length: 1 })
  natClasif: string | null;

  @Column("char", { name: "NatRodas", nullable: true, length: 1 })
  natRodas: string | null;

  @Column("bit", { name: "OblClasif", nullable: true })
  oblClasif: boolean | null;

  @Column("bit", { name: "OblRodas" })
  oblRodas: boolean;

  @Column("bit", { name: "TermClasf", nullable: true })
  termClasf: boolean | null;

  @Column("bit", { name: "TermRodas", nullable: true })
  termRodas: boolean | null;

  @Column("nchar", { name: "Crit1ConsClasif", nullable: true, length: 8 })
  crit1ConsClasif: string | null;

  @Column("nchar", { name: "Crit1ConsRodas", nullable: true, length: 8 })
  crit1ConsRodas: string | null;

  @Column("nchar", { name: "Crit2ConsClasif", nullable: true, length: 8 })
  crit2ConsClasif: string | null;

  @Column("nchar", { name: "Crit2ConsRodas", nullable: true, length: 8 })
  crit2ConsRodas: string | null;

  @Column("nchar", { name: "Crit3ConsClasif", nullable: true, length: 8 })
  crit3ConsClasif: string | null;

  @Column("nchar", { name: "Crit3ConsRodas", nullable: true, length: 8 })
  crit3ConsRodas: string | null;

  @Column("char", { name: "NatCon", nullable: true, length: 1 })
  natCon: string | null;

  @Column("bit", { name: "OblCon", nullable: true })
  oblCon: boolean | null;
}
