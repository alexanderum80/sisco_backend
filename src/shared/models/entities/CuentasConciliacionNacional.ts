import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Cuentas_ConciliacionNacional", { schema: "dbo" })
export class CuentasConciliacionNacional {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "CuentaDB", length: 8 })
  cuentaDb: string;

  @Column("nvarchar", { name: "SubCuentaDB", length: 8 })
  subCuentaDb: string;

  @Column("nvarchar", { name: "CuentaCR", length: 8 })
  cuentaCr: string;

  @Column("nvarchar", { name: "SubCuentaCR", length: 8 })
  subCuentaCr: string;
}
