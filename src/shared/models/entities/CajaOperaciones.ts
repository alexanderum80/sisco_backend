import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { CajaTipoOperacion } from "./CajaTipoOperacion";
import { CajaTipoCajas } from "./CajaTipoCajas";

@Index("PK_OperacionesCaja", ["idOperacion", "idTipoCaja"], { unique: true })
@Entity("Caja_Operaciones", { schema: "dbo" })
export class CajaOperaciones {
  @Column("int", { primary: true, name: "IdOperacion" })
  idOperacion: number;

  @Column("int", { primary: true, name: "IdTipoCaja" })
  idTipoCaja: number;

  @Column("nchar", { name: "Principio", length: 100 })
  principio: string;

  @Column("nchar", { name: "Separador", length: 100 })
  separador: string;

  @ManyToOne(
    () => CajaTipoOperacion,
    (cajaTipoOperacion) => cajaTipoOperacion.cajaOperaciones,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "IdOperacion", referencedColumnName: "idOperacion" }])
  idOperacion2: CajaTipoOperacion;

  @ManyToOne(
    () => CajaTipoCajas,
    (cajaTipoCajas) => cajaTipoCajas.cajaOperaciones,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "IdTipoCaja", referencedColumnName: "idTipoCaja" }])
  idTipoCaja2: CajaTipoCajas;
}
