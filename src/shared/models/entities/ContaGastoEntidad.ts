import { Column, Entity, Index } from "typeorm";

@Index("PK_GastoEntidad", ["eGasto", "tipoEntidad"], { unique: true })
@Entity("Conta_GastoEntidad", { schema: "dbo" })
export class ContaGastoEntidad {
  @Column("nchar", { primary: true, name: "EGasto", length: 10 })
  eGasto: string;

  @Column("int", { primary: true, name: "TipoEntidad" })
  tipoEntidad: number;
}
