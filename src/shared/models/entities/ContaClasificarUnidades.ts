import { Column, Entity, Index } from "typeorm";

@Index("PK_ClasificarUnidades", ["idUnidad", "idTipoEntidad"], { unique: true })
@Entity("Conta_ClasificarUnidades", { schema: "dbo" })
export class ContaClasificarUnidades {
  @Column("int", { primary: true, name: "IdUnidad" })
  idUnidad: number;

  @Column("int", { primary: true, name: "IdTipoEntidad" })
  idTipoEntidad: number;
}
