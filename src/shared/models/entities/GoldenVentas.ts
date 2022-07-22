import { Column, Entity } from "typeorm";

@Entity("Golden_Ventas", { schema: "dbo" })
export class GoldenVentas {
  @Column("int", { name: "IdCentro" })
  idCentro: number;

  @Column("int", { name: "IdUnidad" })
  idUnidad: number;

  @Column("int", { name: "IdPiso" })
  idPiso: number;

  @Column("decimal", { name: "Saldo", precision: 18, scale: 4 })
  saldo: number;

  @Column("int", { name: "Periodo" })
  periodo: number;

  @Column("nvarchar", { name: "EContable", nullable: true, length: 50 })
  eContable: string | null;
}
