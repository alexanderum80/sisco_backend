import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContaComprobarExpresiones } from "./ContaComprobarExpresiones";
import { ContaComprobarValores } from "./ContaComprobarValores";
import { ContaExpresionesDetalle } from "./ContaExpresionesDetalle";

@Index("PK_Conta_ExpresionesResumen", ["idExpresion"], { unique: true })
@Entity("Conta_ExpresionesResumen", { schema: "dbo" })
export class ContaExpresionesResumen {
  @PrimaryGeneratedColumn({ type: "int", name: "IdExpresion" })
  idExpresion: number;

  @Column("nvarchar", { name: "Expresion", length: 100 })
  expresion: string;

  @Column("nvarchar", { name: "Descripcion", nullable: true, length: 255 })
  descripcion: string | null;

  @Column("bit", { name: "Acumulado" })
  acumulado: boolean;

  @Column("bit", { name: "OperacionesInternas" })
  operacionesInternas: boolean;

  @Column("bit", { name: "Centralizada" })
  centralizada: boolean;

  @Column("int", { name: "IdDivision" })
  idDivision: number;

  @OneToMany(
    () => ContaComprobarExpresiones,
    (contaComprobarExpresiones) => contaComprobarExpresiones.idExpresion
  )
  contaComprobarExpresiones: ContaComprobarExpresiones[];

  @OneToMany(
    () => ContaComprobarExpresiones,
    (contaComprobarExpresiones) => contaComprobarExpresiones.idExpresionC
  )
  contaComprobarExpresiones2: ContaComprobarExpresiones[];

  @OneToMany(
    () => ContaComprobarValores,
    (contaComprobarValores) => contaComprobarValores.idExpresion2
  )
  contaComprobarValores: ContaComprobarValores[];

  @OneToMany(
    () => ContaExpresionesDetalle,
    (contaExpresionesDetalle) => contaExpresionesDetalle.idExpresion
  )
  contaExpresionesDetalles: ContaExpresionesDetalle[];
}
