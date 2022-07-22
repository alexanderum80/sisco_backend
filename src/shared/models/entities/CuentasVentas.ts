import { Column, Entity, Index } from "typeorm";

@Index("PK_Cuentas", ["cuenta", "subcuenta"], { unique: true })
@Entity("Cuentas_Ventas", { schema: "dbo" })
export class CuentasVentas {
  @Column("nchar", { primary: true, name: "Cuenta", length: 8 })
  cuenta: string;

  @Column("nchar", { primary: true, name: "Subcuenta", length: 8 })
  subcuenta: string;
}
