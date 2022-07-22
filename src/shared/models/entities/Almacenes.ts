import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Unidades } from "./Unidades";

@Index("PK_Almacenes", ["idGerenciaIdAlmacen", "distribuidor"], {
  unique: true,
})
@Entity("Almacenes", { schema: "dbo" })
export class Almacenes {
  @Column("int", { primary: true, name: "IdGerenciaIdAlmacen" })
  idGerenciaIdAlmacen: number;

  @Column("nvarchar", { name: "Almacen", nullable: true, length: 50 })
  almacen: string | null;

  @Column("int", { name: "IdPiso", nullable: true })
  idPiso: number | null;

  @Column("nvarchar", { name: "EContable", nullable: true, length: 30 })
  eContable: string | null;

  @Column("nvarchar", { name: "EContableMN", nullable: true, length: 30 })
  eContableMn: string | null;

  @Column("bit", { name: "Abierto", default: () => "(0)" })
  abierto: boolean;

  @Column("bit", { name: "Exhibicion", default: () => "(0)" })
  exhibicion: boolean;

  @Column("bit", { name: "Interno", default: () => "(0)" })
  interno: boolean;

  @Column("bit", { name: "Merma", default: () => "(0)" })
  merma: boolean;

  @Column("bit", { name: "Gastronomia", default: () => "(0)" })
  gastronomia: boolean;

  @Column("bit", { name: "Insumo", default: () => "(0)" })
  insumo: boolean;

  @Column("bit", { name: "Inversiones", default: () => "(0)" })
  inversiones: boolean;

  @Column("bit", { name: "Boutique", default: () => "(0)" })
  boutique: boolean;

  @Column("bit", { name: "MermaOrigen", default: () => "(0)" })
  mermaOrigen: boolean;

  @Column("bit", { name: "Consignacion", default: () => "(0)" })
  consignacion: boolean;

  @Column("bit", { name: "Emergente", default: () => "(0)" })
  emergente: boolean;

  @Column("bit", { name: "ReservaDiv", default: () => "(0)" })
  reservaDiv: boolean;

  @Column("bit", { name: "ReservaNac", default: () => "(0)" })
  reservaNac: boolean;

  @Column("bit", { name: "DespachoDiv", default: () => "(0)" })
  despachoDiv: boolean;

  @Column("bit", { name: "OrigenReplica", default: () => "(0)" })
  origenReplica: boolean;

  @Column("bit", { name: "DestinoReplica", default: () => "(0)" })
  destinoReplica: boolean;

  @Column("real", {
    name: "CapacidadFrio",
    precision: 24,
    default: () => "(0)",
  })
  capacidadFrio: number;

  @Column("bit", { name: "Ociosos", default: () => "(0)" })
  ociosos: boolean;

  @Column("bit", { name: "LentoMov", default: () => "(0)" })
  lentoMov: boolean;

  @Column("bit", { name: "MercanciaVenta", default: () => "(0)" })
  mercanciaVenta: boolean;

  @Column("bit", { primary: true, name: "Distribuidor", default: () => "(0)" })
  distribuidor: boolean;

  @ManyToOne(() => Unidades, (unidades) => unidades.almacenes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "IdUnidad", referencedColumnName: "idUnidad" }])
  idUnidad: Unidades;
}
