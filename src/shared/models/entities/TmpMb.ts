import { Column, Entity } from "typeorm";

@Entity("tmpMB", { schema: "dbo" })
export class TmpMb {
  @Column("nvarchar", { name: "IdUnidad", length: 3 })
  idUnidad: string;

  @Column("nvarchar", { name: "Periodo", length: 2 })
  periodo: string;

  @Column("nvarchar", { name: "Submayor", length: 1 })
  submayor: string;

  @Column("nvarchar", { name: "Inventa", length: 10 })
  inventa: string;

  @Column("nvarchar", { name: "CtaSCta", length: 9 })
  ctaSCta: string;

  @Column("nvarchar", { name: "Anal1", nullable: true, length: 20 })
  anal1: string | null;

  @Column("nvarchar", { name: "Anal2", nullable: true, length: 20 })
  anal2: string | null;

  @Column("nvarchar", { name: "Anal3", nullable: true, length: 20 })
  anal3: string | null;

  @Column("nvarchar", { name: "CtaSCtaD", length: 9 })
  ctaSCtaD: string;

  @Column("nvarchar", { name: "AnD1", nullable: true, length: 20 })
  anD1: string | null;

  @Column("nvarchar", { name: "AnD2", nullable: true, length: 20 })
  anD2: string | null;

  @Column("nvarchar", { name: "AnD3", nullable: true, length: 20 })
  anD3: string | null;

  @Column("nvarchar", { name: "CtaSctaG", nullable: true, length: 9 })
  ctaSctaG: string | null;

  @Column("nvarchar", { name: "AnG1", nullable: true, length: 20 })
  anG1: string | null;

  @Column("nvarchar", { name: "AnG2", nullable: true, length: 20 })
  anG2: string | null;

  @Column("nvarchar", { name: "AnG3", nullable: true, length: 20 })
  anG3: string | null;

  @Column("float", { name: "ValorI", nullable: true, precision: 53 })
  valorI: number | null;

  @Column("float", { name: "Repara", nullable: true, precision: 53 })
  repara: number | null;

  @Column("float", { name: "UDepP", nullable: true, precision: 53 })
  uDepP: number | null;

  @Column("float", { name: "DepAc", nullable: true, precision: 53 })
  depAc: number | null;

  @Column("float", { name: "TasaD", nullable: true, precision: 53 })
  tasaD: number | null;

  @Column("nvarchar", { name: "ALEX", nullable: true, length: 1 })
  alex: string | null;

  @Column("nvarchar", { name: "Area", nullable: true, length: 10 })
  area: string | null;

  @Column("float", { name: "Revalorizacion", nullable: true, precision: 53 })
  revalorizacion: number | null;

  @Column("smallint", { name: "mbaja", nullable: true })
  mbaja: number | null;

  @Column("smallint", { name: "malta", nullable: true })
  malta: number | null;
}
