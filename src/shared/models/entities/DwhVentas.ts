import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_DWH_Ventas", ["id"], { unique: true })
@Entity("DWH_Ventas", { schema: "dbo" })
export class DwhVentas {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "IdCentro" })
  idCentro: number;

  @Column("int", { name: "IdUnidad" })
  idUnidad: number;

  @Column("int", { name: "IdPiso" })
  idPiso: number;

  @Column("int", { name: "Periodo" })
  periodo: number;

  @Column("decimal", { name: "Saldo", precision: 18, scale: 4 })
  saldo: number;

  @Column("decimal", {
    name: "SaldoDist",
    precision: 18,
    scale: 4,
    default: () => "(0)",
  })
  saldoDist: number;

  @Column("decimal", {
    name: "SaldoRest",
    precision: 18,
    scale: 4,
    default: () => "(0)",
  })
  saldoRest: number;
}
