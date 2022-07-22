import { Column, Entity, Index, OneToMany } from "typeorm";
import { Subdivisiones } from "./Subdivisiones";

@Index("PK_Divisiones", ["idDivision"], { unique: true })
@Entity("Divisiones", { schema: "dbo" })
export class Divisiones {
  @Column("int", { primary: true, name: "IdDivision" })
  idDivision: number;

  @Column("nvarchar", { name: "Division", nullable: true })
  division: string | null;

  @OneToMany(() => Subdivisiones, (subdivisiones) => subdivisiones.idDivision)
  subdivisiones: Subdivisiones[];
}
