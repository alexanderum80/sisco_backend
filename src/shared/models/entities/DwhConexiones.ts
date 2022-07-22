import { Column, Entity, Index } from "typeorm";

@Index("PK_DWH_Conexiones", ["idUnidad"], { unique: true })
@Entity("DWH_Conexiones", { schema: "dbo" })
export class DwhConexiones {
  @Column("int", { primary: true, name: "IdUnidad" })
  idUnidad: number;

  @Column("nvarchar", { name: "ConexionRest", nullable: true })
  conexionRest: string | null;

  @Column("nvarchar", { name: "ConexionDWH", nullable: true })
  conexionDwh: string | null;

  @Column("nvarchar", { name: "ServidorDist", nullable: true, length: 20 })
  servidorDist: string | null;
}
