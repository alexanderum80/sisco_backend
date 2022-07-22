import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Divisiones } from "./Divisiones";
import { Unidades } from "./Unidades";

@Index("PK_Subdivisiones", ["idSubdivision"], { unique: true })
@Entity("Subdivisiones", { schema: "dbo" })
export class Subdivisiones {
  @Column("int", { primary: true, name: "IdSubdivision" })
  idSubdivision: number;

  @Column("nvarchar", { name: "Subdivision", nullable: true })
  subdivision: string | null;

  @ManyToOne(() => Divisiones, (divisiones) => divisiones.subdivisiones, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "IdDivision", referencedColumnName: "idDivision" }])
  idDivision: Divisiones;

  @OneToMany(() => Unidades, (unidades) => unidades.idSubdivision)
  unidades: Unidades[];
}
