import { Column, Entity } from "typeorm";

@Entity("Conta_EGastoCuenta", { schema: "dbo" })
export class ContaEGastoCuenta {
  @Column("nvarchar", { name: "IdEGasto", nullable: true, length: 5 })
  idEGasto: string | null;

  @Column("nchar", { name: "Cuenta", nullable: true, length: 8 })
  cuenta: string | null;
}
