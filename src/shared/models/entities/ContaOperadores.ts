import { Column, Entity, Index, OneToMany } from "typeorm";
import { ContaComprobarExpresiones } from "./ContaComprobarExpresiones";
import { ContaComprobarValores } from "./ContaComprobarValores";

@Index("PK_Conta_Operadores", ["id"], { unique: true })
@Entity("Conta_Operadores", { schema: "dbo" })
export class ContaOperadores {
  @Column("nvarchar", { primary: true, name: "Id", length: 3 })
  id: string;

  @Column("nvarchar", { name: "Operador", nullable: true, length: 2 })
  operador: string | null;

  @OneToMany(
    () => ContaComprobarExpresiones,
    (contaComprobarExpresiones) => contaComprobarExpresiones.idOperador
  )
  contaComprobarExpresiones: ContaComprobarExpresiones[];

  @OneToMany(
    () => ContaComprobarValores,
    (contaComprobarValores) => contaComprobarValores.idOperador
  )
  contaComprobarValores: ContaComprobarValores[];
}
