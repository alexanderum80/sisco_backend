import { Column, Entity, Index, OneToMany } from "typeorm";
import { ContaExpresionesDetalle } from "./ContaExpresionesDetalle";

@Index("PK_Conta_TipoValor", ["idTipoValor"], { unique: true })
@Entity("Conta_TipoValorExpresiones", { schema: "dbo" })
export class ContaTipoValorExpresiones {
  @Column("int", { primary: true, name: "IdTipoValor" })
  idTipoValor: number;

  @Column("nvarchar", { name: "Valor", length: 50 })
  valor: string;

  @OneToMany(
    () => ContaExpresionesDetalle,
    (contaExpresionesDetalle) => contaExpresionesDetalle.tipoValor
  )
  contaExpresionesDetalles: ContaExpresionesDetalle[];
}
