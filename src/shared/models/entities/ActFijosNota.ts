import { Column, Entity } from "typeorm";

@Entity("ActFijos_Nota", { schema: "dbo" })
export class ActFijosNota {
  @Column("int", { name: "IdCentro" })
  idCentro: number;

  @Column("int", { name: "Periodo" })
  periodo: number;

  @Column("int", { name: "Año" })
  aO: number;

  @Column("nvarchar", { name: "Nota" })
  nota: string;

  @Column("int", { name: "IdEmpleado", nullable: true })
  idEmpleado: number | null;

  @Column("int", { name: "IdSupervisor", nullable: true })
  idSupervisor: number | null;
}
