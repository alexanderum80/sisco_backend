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

@Index("IX_Conta_ComprobarValores", ["idCentro", "idExpresion", "idDivision"], {
  unique: true,
})
@Index("PK_Conta_ComprobarValores", ["id"], { unique: true })
@Entity("Conta_ComprobarValores", { schema: "dbo" })
export class ContaComprobarValores {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "IdCentro" })
  idCentro: number;

  @Column("int", { name: "IdExpresion" })
  idExpresion: number;

  @Column("money", { name: "Valor", default: () => "(0)" })
  valor: number;

  @Column("int", { name: "IdDivision" })
  idDivision: number;

  @ManyToOne(
    () => ContaExpresionesResumen,
    (contaExpresionesResumen) => contaExpresionesResumen.contaComprobarValores,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "IdExpresion", referencedColumnName: "idExpresion" }])
  idExpresion2: ContaExpresionesResumen;

  @ManyToOne(
    () => ContaOperadores,
    (contaOperadores) => contaOperadores.contaComprobarValores
  )
  @JoinColumn([{ name: "IdOperador", referencedColumnName: "id" }])
  idOperador: ContaOperadores;
}
