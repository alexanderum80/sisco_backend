import { Column, Entity, Index } from "typeorm";

@Index("PK_UtilesCategorias", ["idCentro", "idUnidad", "codCategoria"], {
  unique: true,
})
@Entity("Utiles_Categoria", { schema: "dbo" })
export class UtilesCategoria {
  @Column("int", { primary: true, name: "IdCentro" })
  idCentro: number;

  @Column("int", { primary: true, name: "IdUnidad" })
  idUnidad: number;

  @Column("varchar", { primary: true, name: "CodCategoria", length: 2 })
  codCategoria: string;

  @Column("varchar", { name: "Categoria", nullable: true, length: 20 })
  categoria: string | null;

  @Column("varchar", { name: "CuentaMN", nullable: true, length: 5 })
  cuentaMn: string | null;

  @Column("varchar", { name: "SubCuentaMN", nullable: true, length: 5 })
  subCuentaMn: string | null;

  @Column("varchar", { name: "Analisis1MN", nullable: true, length: 20 })
  analisis1Mn: string | null;

  @Column("varchar", { name: "Analisis2MN", nullable: true, length: 20 })
  analisis2Mn: string | null;

  @Column("varchar", { name: "Analisis3MN", nullable: true, length: 20 })
  analisis3Mn: string | null;

  @Column("varchar", { name: "CuentaMLC", nullable: true, length: 5 })
  cuentaMlc: string | null;

  @Column("varchar", { name: "SubCuentaMLC", nullable: true, length: 5 })
  subCuentaMlc: string | null;

  @Column("varchar", { name: "Analisis1MLC", nullable: true, length: 20 })
  analisis1Mlc: string | null;

  @Column("varchar", { name: "Analisis2MLC", nullable: true, length: 20 })
  analisis2Mlc: string | null;

  @Column("varchar", { name: "Analisis3MLC", nullable: true, length: 20 })
  analisis3Mlc: string | null;

  @Column("varchar", { name: "CuentaMND", nullable: true, length: 5 })
  cuentaMnd: string | null;

  @Column("varchar", { name: "SubCuentaMND", nullable: true, length: 5 })
  subCuentaMnd: string | null;

  @Column("varchar", { name: "Analisis1MND", nullable: true, length: 20 })
  analisis1Mnd: string | null;

  @Column("varchar", { name: "Analisis2MND", nullable: true, length: 20 })
  analisis2Mnd: string | null;

  @Column("varchar", { name: "Analisis3MND", nullable: true, length: 20 })
  analisis3Mnd: string | null;

  @Column("varchar", { name: "CuentaMLCD", nullable: true, length: 5 })
  cuentaMlcd: string | null;

  @Column("varchar", { name: "SubCuentaMLCD", nullable: true, length: 5 })
  subCuentaMlcd: string | null;

  @Column("varchar", { name: "Analisis1MLCD", nullable: true, length: 20 })
  analisis1Mlcd: string | null;

  @Column("varchar", { name: "Analisis2MLCD", nullable: true, length: 20 })
  analisis2Mlcd: string | null;

  @Column("varchar", { name: "Analisis3MLCD", nullable: true, length: 20 })
  analisis3Mlcd: string | null;

  @Column("varchar", { name: "CuentaMNG", nullable: true, length: 5 })
  cuentaMng: string | null;

  @Column("varchar", { name: "SubCuentaMNG", nullable: true, length: 5 })
  subCuentaMng: string | null;

  @Column("varchar", { name: "Analisis1MNG", nullable: true, length: 20 })
  analisis1Mng: string | null;

  @Column("varchar", { name: "Analisis2MNG", nullable: true, length: 20 })
  analisis2Mng: string | null;

  @Column("varchar", { name: "Analisis3MNG", nullable: true, length: 20 })
  analisis3Mng: string | null;

  @Column("varchar", { name: "CuentaMLCG", nullable: true, length: 5 })
  cuentaMlcg: string | null;

  @Column("varchar", { name: "SubCuentaMLCG", nullable: true, length: 5 })
  subCuentaMlcg: string | null;

  @Column("varchar", { name: "Analisis1MLCG", nullable: true, length: 20 })
  analisis1Mlcg: string | null;

  @Column("varchar", { name: "Analisis2MLCG", nullable: true, length: 20 })
  analisis2Mlcg: string | null;

  @Column("varchar", { name: "Analisis3MLCG", nullable: true, length: 20 })
  analisis3Mlcg: string | null;
}
