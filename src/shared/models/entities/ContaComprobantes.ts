import { Column, Entity, Index } from "typeorm";

@Index("PK_Comprobante", ["centro", "consolidado", "aO", "tipo", "nMero"], {
  unique: true,
})
@Entity("Conta_Comprobantes", { schema: "dbo" })
export class ContaComprobantes {
  @Column("int", { primary: true, name: "Centro" })
  centro: number;

  @Column("bit", { primary: true, name: "Consolidado" })
  consolidado: boolean;

  @Column("nvarchar", { primary: true, name: "Año", length: 4 })
  aO: string;

  @Column("nchar", { primary: true, name: "Tipo", length: 3 })
  tipo: string;

  @Column("nchar", { primary: true, name: "Número", length: 5 })
  nMero: string;

  @Column("smallint", { name: "Período", nullable: true })
  perOdo: number | null;

  @Column("datetime", { name: "Fecha", nullable: true })
  fecha: Date | null;

  @Column("nvarchar", {
    name: "Descripción",
    nullable: true,
    length: 255,
    default: () => "''",
  })
  descripciN: string | null;

  @Column("nchar", {
    name: "Estado",
    nullable: true,
    length: 1,
    default: () => "'I'",
  })
  estado: string | null;

  @Column("nvarchar", { name: "Usuario", nullable: true, length: 20 })
  usuario: string | null;

  @Column("datetime", { name: "Ultima Actualización", nullable: true })
  ultimaActualizaciN: Date | null;

  @Column("nvarchar", {
    name: "Traspasado por",
    nullable: true,
    length: 20,
    default: () => "''",
  })
  traspasadoPor: string | null;

  @Column("datetime", {
    name: "Fecha Traspaso",
    nullable: true,
    default: () => "((1)/(1))/(1900)",
  })
  fechaTraspaso: Date | null;

  @Column("float", {
    name: "Débito",
    nullable: true,
    precision: 53,
    default: () => "(0)",
  })
  dBito: number | null;

  @Column("float", {
    name: "Crédito",
    nullable: true,
    precision: 53,
    default: () => "(0)",
  })
  crDito: number | null;

  @Column("nvarchar", {
    name: "Usuario Red",
    nullable: true,
    length: 20,
    default: () => "''",
  })
  usuarioRed: string | null;

  @Column("char", { name: "marca_importado", nullable: true, length: 1 })
  marcaImportado: string | null;

  @Column("varchar", { name: "subsistema", nullable: true, length: 2 })
  subsistema: string | null;

  @Column("varchar", { name: "siglas", nullable: true, length: 10 })
  siglas: string | null;
}
