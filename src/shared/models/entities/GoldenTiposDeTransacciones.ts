import { Column, Entity } from "typeorm";

@Entity("Golden_Tipos de Transacciones", { schema: "dbo" })
export class GoldenTiposDeTransacciones {
  @Column("tinyint", { name: "IdTransaccion" })
  idTransaccion: number;

  @Column("nvarchar", { name: "Transaccion", length: 50 })
  transaccion: string;

  @Column("nvarchar", { name: "TablaResumen", nullable: true, length: 50 })
  tablaResumen: string | null;
}
