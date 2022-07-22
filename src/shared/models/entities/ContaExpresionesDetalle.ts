import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContaExpresionesResumen } from "./ContaExpresionesResumen";
import { ContaTipoValorExpresiones } from "./ContaTipoValorExpresiones";

@Index("PK_Conta_ExpresionesDetalle", ["id"], { unique: true })
@Entity("Conta_ExpresionesDetalle", { schema: "dbo" })
export class ContaExpresionesDetalle {
  @Column("nvarchar", { name: "Centro", nullable: true, length: 3 })
  centro: string | null;

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

  @Column("nvarchar", { name: "Signo", length: 1 })
  signo: string;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("decimal", {
    name: "PorCiento",
    nullable: true,
    precision: 18,
    scale: 0,
  })
  porCiento: number | null;

  @ManyToOne(
    () => ContaExpresionesResumen,
    (contaExpresionesResumen) =>
      contaExpresionesResumen.contaExpresionesDetalles,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "IdExpresion", referencedColumnName: "idExpresion" }])
  idExpresion: ContaExpresionesResumen;

  @ManyToOne(
    () => ContaTipoValorExpresiones,
    (contaTipoValorExpresiones) =>
      contaTipoValorExpresiones.contaExpresionesDetalles,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "TipoValor", referencedColumnName: "idTipoValor" }])
  tipoValor: ContaTipoValorExpresiones;
}
