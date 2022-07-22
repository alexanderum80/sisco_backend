import { Column, Entity, Index } from "typeorm";

@Index(
  "PK_CuentaEntidad",
  ["cuenta", "subCuenta", "tipoEntidad", "tipoClasificador"],
  { unique: true }
)
@Entity("Conta_CuentaEntidad", { schema: "dbo" })
export class ContaCuentaEntidad {
  @Column("nchar", { primary: true, name: "Cuenta", length: 8 })
  cuenta: string;

  @Column("nchar", { primary: true, name: "SubCuenta", length: 8 })
  subCuenta: string;

  @Column("int", { primary: true, name: "TipoEntidad" })
  tipoEntidad: number;

  @Column("int", { primary: true, name: "TipoClasificador" })
  tipoClasificador: number;
}
