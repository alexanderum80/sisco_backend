import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cargos } from "./Cargos";

@Index("PK_Empleado", ["idEmpleado"], { unique: true })
@Entity("Empleado", { schema: "dbo" })
export class Empleado {
  @PrimaryGeneratedColumn({ type: "int", name: "IdEmpleado" })
  idEmpleado: number;

  @Column("nvarchar", { name: "Empleado", length: 100 })
  empleado: string;

  @Column("int", { name: "IdDivision" })
  idDivision: number;

  @ManyToOne(() => Cargos, (cargos) => cargos.empleados, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "IdCargo", referencedColumnName: "idCargo" }])
  idCargo: Cargos;
}
