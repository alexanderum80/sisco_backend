import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cargos } from "./Cargos";

@Index("PK_Supervisor", ["idSupervisor"], { unique: true })
@Entity("Supervisor", { schema: "dbo" })
export class Supervisor {
  @PrimaryGeneratedColumn({ type: "int", name: "IdSupervisor" })
  idSupervisor: number;

  @Column("nvarchar", { name: "Supervisor", length: 100 })
  supervisor: string;

  @Column("int", { name: "IdDivision" })
  idDivision: number;

  @ManyToOne(() => Cargos, (cargos) => cargos.supervisors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "IdCargo", referencedColumnName: "idCargo" }])
  idCargo: Cargos;
}
