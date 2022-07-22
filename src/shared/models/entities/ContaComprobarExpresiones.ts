import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContaExpresionesResumen } from "./ContaExpresionesResumen";
import { ContaOperadores } from "./ContaOperadores";

@Index("PK_Conta_ComprobarExpresiones", ["id"], { unique: true })
@Entity("Conta_ComprobarExpresiones", { schema: "dbo" })
export class ContaComprobarExpresiones {
  @Column("bit", { name: "Centro" })
  centro: boolean;

  @Column("bit", { name: "Con" })
  con: boolean;

  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("bit", { name: "Complejo", default: () => "(0)" })
  complejo: boolean;

  @Column("int", { name: "Centralizada" })
  centralizada: number;

  @Column("int", { name: "IdDivision" })
  idDivision: number;

  @ManyToOne(
    () => ContaExpresionesResumen,
    (contaExpresionesResumen) =>
      contaExpresionesResumen.contaComprobarExpresiones,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "IdExpresion", referencedColumnName: "idExpresion" }])
  idExpresion: ContaExpresionesResumen;

  @ManyToOne(
    () => ContaOperadores,
    (contaOperadores) => contaOperadores.contaComprobarExpresiones
  )
  @JoinColumn([{ name: "IdOperador", referencedColumnName: "id" }])
  idOperador: ContaOperadores;

  @ManyToOne(
    () => ContaExpresionesResumen,
    (contaExpresionesResumen) =>
      contaExpresionesResumen.contaComprobarExpresiones2
  )
  @JoinColumn([{ name: "IdExpresionC", referencedColumnName: "idExpresion" }])
  idExpresionC: ContaExpresionesResumen;
}
