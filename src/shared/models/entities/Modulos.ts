import { Column, Entity, Index } from "typeorm";

@Index("PK_Modulos", ["idModulo"], { unique: true })
@Entity("Modulos", { schema: "dbo" })
export class Modulos {
  @Column("int", { primary: true, name: "IdModulo" })
  idModulo: number;

  @Column("nchar", { name: "Modulo", length: 50 })
  modulo: string;

  @Column("nchar", { name: "Version", length: 10 })
  version: string;

  @Column("nchar", { name: "Carpeta", length: 10 })
  carpeta: string;

  @Column("bit", { name: "Adicionar" })
  adicionar: boolean;

  @Column("bit", { name: "Actualizar" })
  actualizar: boolean;
}
