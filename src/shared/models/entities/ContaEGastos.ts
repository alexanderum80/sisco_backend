import { Column, Entity, Index } from "typeorm";

@Index("PK_ElementosGastos", ["egasto"], { unique: true })
@Entity("Conta_EGastos", { schema: "dbo" })
export class ContaEGastos {
  @Column("nvarchar", { primary: true, name: "Egasto", length: 5 })
  egasto: string;

  @Column("nvarchar", { name: "Descripcion", nullable: true, length: 255 })
  descripcion: string | null;

  @Column("nvarchar", { name: "UsoContenido", nullable: true, length: 255 })
  usoContenido: string | null;

  @Column("nvarchar", { name: "TipoEntidad", nullable: true })
  tipoEntidad: string | null;

  @Column("nvarchar", { name: "CuentaAsociada", nullable: true, length: 255 })
  cuentaAsociada: string | null;

  @Column("int", { name: "IdEpigrafe", nullable: true })
  idEpigrafe: number | null;
}
