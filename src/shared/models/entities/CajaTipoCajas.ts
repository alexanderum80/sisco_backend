import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CajaOperaciones } from "./CajaOperaciones";

@Index("PK_TipoCajas", ["idTipoCaja"], { unique: true })
@Entity("Caja_TipoCajas", { schema: "dbo" })
export class CajaTipoCajas {
  @PrimaryGeneratedColumn({ type: "int", name: "IdTipoCaja" })
  idTipoCaja: number;

  @Column("nchar", { name: "Caja", length: 10 })
  caja: string;

  @Column("nchar", { name: "TipoCaja", length: 10 })
  tipoCaja: string;

  @OneToMany(
    () => CajaOperaciones,
    (cajaOperaciones) => cajaOperaciones.idTipoCaja2
  )
  cajaOperaciones: CajaOperaciones[];
}
