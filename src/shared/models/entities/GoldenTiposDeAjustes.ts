import { Column, Entity } from "typeorm";

@Entity("Golden_Tipos de Ajustes", { schema: "dbo" })
export class GoldenTiposDeAjustes {
  @Column("tinyint", { name: "IdTipoAjuste", nullable: true })
  idTipoAjuste: number | null;

  @Column("nvarchar", { name: "TipoAjuste", length: 50 })
  tipoAjuste: string;

  @Column("smallint", { name: "Signo" })
  signo: number;
}
