import { Column, Entity } from "typeorm";

@Entity("Golden_SubMayor", { schema: "dbo" })
export class GoldenSubMayor {
  @Column("int", { name: "IdAlmacen" })
  idAlmacen: number;

  @Column("int", { name: "IdGerencia" })
  idGerencia: number;

  @Column("int", { name: "IdProducto" })
  idProducto: number;

  @Column("int", { name: "IdTransaccion" })
  idTransaccion: number;

  @Column("int", { name: "Documento" })
  documento: number;

  @Column("decimal", { name: "PCosto", precision: 18, scale: 2 })
  pCosto: number;

  @Column("decimal", { name: "PCostoMN", precision: 18, scale: 2 })
  pCostoMn: number;

  @Column("decimal", { name: "POperacion", precision: 18, scale: 2 })
  pOperacion: number;

  @Column("decimal", { name: "POperacionMN", precision: 18, scale: 2 })
  pOperacionMn: number;

  @Column("datetime", { name: "Fecha" })
  fecha: Date;

  @Column("float", { name: "Cantidad", precision: 53 })
  cantidad: number;

  @Column("float", { name: "SaldoAnterior", precision: 53 })
  saldoAnterior: number;

  @Column("nvarchar", { name: "Otros", length: 50 })
  otros: string;

  @Column("nchar", { name: "IdProveedor", length: 10 })
  idProveedor: string;

  @Column("nchar", { name: "IdTaller", length: 10 })
  idTaller: string;
}
