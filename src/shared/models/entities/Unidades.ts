import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Almacenes } from "./Almacenes";
import { Subdivisiones } from "./Subdivisiones";

@Index("PK_Unidades", ["idUnidad"], { unique: true })
@Entity("Unidades", { schema: "dbo" })
export class Unidades {
  @Column("int", { primary: true, name: "IdUnidad" })
  idUnidad: number;

  @Column("nvarchar", { name: "Nombre", nullable: true })
  nombre: string | null;

  @Column("int", { name: "IdComplejo", nullable: true })
  idComplejo: number | null;

  @Column("int", { name: "IdDivision", nullable: true })
  idDivision: number | null;

  @Column("nchar", { name: "Provincia", nullable: true, length: 3 })
  provincia: string | null;

  @Column("int", { name: "Tipo", nullable: true })
  tipo: number | null;

  @Column("int", { name: "UltimoAsiento", nullable: true })
  ultimoAsiento: number | null;

  @Column("datetime", { name: "UltimaActualizacion", nullable: true })
  ultimaActualizacion: Date | null;

  @Column("int", { name: "UltimoPeriodo", nullable: true })
  ultimoPeriodo: number | null;

  @Column("int", {
    name: "UltimoAsientoC",
    nullable: true,
    default: () => "(0)",
  })
  ultimoAsientoC: number | null;

  @Column("int", { name: "Año", nullable: true })
  aO: number | null;

  @Column("bit", { name: "Abierta", nullable: true })
  abierta: boolean | null;

  @OneToMany(() => Almacenes, (almacenes) => almacenes.idUnidad)
  almacenes: Almacenes[];

  @ManyToOne(() => Subdivisiones, (subdivisiones) => subdivisiones.unidades, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "IdSubdivision", referencedColumnName: "idSubdivision" },
  ])
  idSubdivision: Subdivisiones;
}
