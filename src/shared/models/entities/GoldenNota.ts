import { Column, Entity, Index } from "typeorm";

@Index("PK_Golden_Nota", ["idCentro", "periodo", "aO"], { unique: true })
@Entity("Golden_Nota", { schema: "dbo" })
export class GoldenNota {
  @Column("int", { primary: true, name: "IdCentro" })
  idCentro: number;

  @Column("int", { primary: true, name: "Periodo" })
  periodo: number;

  @Column("int", { primary: true, name: "Año" })
  aO: number;

  @Column("nvarchar", { name: "Nota" })
  nota: string;

  @Column("int", { name: "IdEmpleado", nullable: true })
  idEmpleado: number | null;

  @Column("int", { name: "IdSupervisor", nullable: true })
  idSupervisor: number | null;
}
