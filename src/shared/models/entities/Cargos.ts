import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Empleado } from "./Empleado";
import { Supervisor } from "./Supervisor";

@Index("PK_Cargos", ["idCargo"], { unique: true })
@Entity("Cargos", { schema: "dbo" })
export class Cargos {
  @PrimaryGeneratedColumn({ type: "int", name: "IdCargo" })
  idCargo: number;

  @Column("nvarchar", { name: "Cargo", length: 50 })
  cargo: string;

  @OneToMany(() => Empleado, (empleado) => empleado.idCargo)
  empleados: Empleado[];

  @OneToMany(() => Supervisor, (supervisor) => supervisor.idCargo)
  supervisors: Supervisor[];
}
