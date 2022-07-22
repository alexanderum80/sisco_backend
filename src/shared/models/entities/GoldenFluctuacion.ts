import { Column, Entity } from "typeorm";

@Entity("Golden_Fluctuacion", { schema: "dbo" })
export class GoldenFluctuacion {
  @Column("int", { name: "Id", nullable: true })
  id: number | null;

  @Column("int", { name: "IdGerencia", nullable: true })
  idGerencia: number | null;

  @Column("int", { name: "IdCentro", nullable: true })
  idCentro: number | null;

  @Column("int", { name: "IdAlmacen", nullable: true })
  idAlmacen: number | null;

  @Column("decimal", {
    name: "PCosto",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  pCosto: number | null;

  @Column("decimal", {
    name: "PCostoMN",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  pCostoMn: number | null;

  @Column("nchar", { name: "Codigo", nullable: true, length: 15 })
  codigo: string | null;

  @Column("decimal", {
    name: "PCostoI",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  pCostoI: number | null;

  @Column("decimal", {
    name: "PCostoMNI",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  pCostoMni: number | null;

  @Column("decimal", { name: "Saldo", nullable: true, precision: 18, scale: 2 })
  saldo: number | null;

  @Column("decimal", {
    name: "DiferenciaCosto",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  diferenciaCosto: number | null;

  @Column("decimal", {
    name: "DiferenciaCostoMN",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  diferenciaCostoMn: number | null;

  @Column("decimal", {
    name: "DiferenciaImporte",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  diferenciaImporte: number | null;

  @Column("decimal", {
    name: "DiferenciaImporteMN",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  diferenciaImporteMn: number | null;

  @Column("int", { name: "Periodo" })
  periodo: number;

  @Column("nvarchar", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("nvarchar", { name: "Almacen", nullable: true })
  almacen: string | null;
}
