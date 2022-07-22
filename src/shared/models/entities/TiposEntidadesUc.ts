import { Column, Entity, Index } from "typeorm";

@Index("PK_Tipos_1", ["idTipo"], { unique: true })
@Entity("TiposEntidadesUC", { schema: "dbo" })
export class TiposEntidadesUc {
  @Column("tinyint", { primary: true, name: "IdTipo" })
  idTipo: number;

  @Column("nvarchar", { name: "Tipo", length: 50 })
  tipo: string;

  @Column("int", { name: "IdContaTipo", nullable: true })
  idContaTipo: number | null;
}
