import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CajaOperaciones } from "./CajaOperaciones";

@Index("PK_TipoOperacionCaja", ["idOperacion"], { unique: true })
@Entity("Caja_TipoOperacion", { schema: "dbo" })
export class CajaTipoOperacion {
  @PrimaryGeneratedColumn({ type: "int", name: "IdOperacion" })
  idOperacion: number;

  @Column("nchar", { name: "Operacion", nullable: true, length: 10 })
  operacion: string | null;

  @OneToMany(
    () => CajaOperaciones,
    (cajaOperaciones) => cajaOperaciones.idOperacion2
  )
  cajaOperaciones: CajaOperaciones[];
}
