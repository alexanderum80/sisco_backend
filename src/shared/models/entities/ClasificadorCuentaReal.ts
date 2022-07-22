import { Column, Entity, Index } from "typeorm";

@Index("PK_Clasificador", ["cuenta", "subCuenta", "tipoClasificador"], {
  unique: true,
})
@Entity("Clasificador_Cuenta_Real", { schema: "dbo" })
export class ClasificadorCuentaReal {
  @Column("nvarchar", { primary: true, name: "Cuenta", length: 8 })
  cuenta: string;

  @Column("nvarchar", { primary: true, name: "SubCuenta", length: 8 })
  subCuenta: string;

  @Column("nvarchar", { name: "Descripcion", nullable: true, length: 255 })
  descripcion: string | null;

  @Column("nvarchar", { name: "Naturaleza", length: 1 })
  naturaleza: string;

  @Column("nvarchar", { name: "Crit1", nullable: true, length: 10 })
  crit1: string | null;

  @Column("nvarchar", { name: "Crit2", nullable: true, length: 10 })
  crit2: string | null;

  @Column("nvarchar", { name: "Crit3", nullable: true, length: 10 })
  crit3: string | null;

  @Column("bit", { name: "Obligacion", nullable: true })
  obligacion: boolean | null;

  @Column("int", {
    primary: true,
    name: "TipoClasificador",
    default: () => "(1)",
  })
  tipoClasificador: number;

  @Column("nvarchar", { name: "SeUtiliza", nullable: true })
  seUtiliza: string | null;

  @Column("bit", { name: "Terminal", nullable: true })
  terminal: boolean | null;

  @Column("nvarchar", {
    name: "Crit1Consolidacion",
    nullable: true,
    length: 10,
  })
  crit1Consolidacion: string | null;

  @Column("nvarchar", {
    name: "Crit2Consolidacion",
    nullable: true,
    length: 10,
  })
  crit2Consolidacion: string | null;

  @Column("nvarchar", {
    name: "Crit3Consolidacion",
    nullable: true,
    length: 10,
  })
  crit3Consolidacion: string | null;
}
