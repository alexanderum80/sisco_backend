import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Conta_NoUsarenCta", ["id"], { unique: true })
@Entity("Conta_NoUsarenCta", { schema: "dbo" })
export class ContaNoUsarenCta {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "Codigo", nullable: true, length: 3 })
  codigo: string | null;

  @Column("nvarchar", { name: "Cta", nullable: true, length: 8 })
  cta: string | null;

  @Column("nvarchar", { name: "SubCta", nullable: true, length: 8 })
  subCta: string | null;

  @Column("nvarchar", { name: "Crit1", nullable: true, length: 10 })
  crit1: string | null;

  @Column("nvarchar", { name: "Crit2", nullable: true, length: 10 })
  crit2: string | null;

  @Column("nvarchar", { name: "Crit3", nullable: true, length: 10 })
  crit3: string | null;

  @Column("nvarchar", { name: "TextoInicio", nullable: true, length: 255 })
  textoInicio: string | null;

  @Column("int", { name: "Centralizada" })
  centralizada: number;

  @Column("int", { name: "IdDivision" })
  idDivision: number;
}
