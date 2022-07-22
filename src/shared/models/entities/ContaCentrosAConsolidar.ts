import { Column, Entity, Index } from "typeorm";

@Index("PK_Centros", ["centro", "unidad", "anio", "periodo"], { unique: true })
@Entity("Conta_CentrosAConsolidar", { schema: "dbo" })
export class ContaCentrosAConsolidar {
  @Column("int", { primary: true, name: "Centro" })
  centro: number;

  @Column("int", { primary: true, name: "Unidad" })
  unidad: number;

  @Column("int", { primary: true, name: "Anio" })
  anio: number;

  @Column("int", { primary: true, name: "Periodo" })
  periodo: number;

  @Column("bit", { name: "Seleccionar", default: () => "(0)" })
  seleccionar: boolean;

  @Column("bit", { name: "Correcto", default: () => "(0)" })
  correcto: boolean;

  @Column("bit", { name: "EsConsolidado", default: () => "(0)" })
  esConsolidado: boolean;

  @Column("bit", { name: "EsCentro", default: () => "(0)" })
  esCentro: boolean;

  @Column("bit", { name: "EsComplejo", default: () => "(0)" })
  esComplejo: boolean;
}
