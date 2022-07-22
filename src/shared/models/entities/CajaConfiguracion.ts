import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Caja_Configuracion", ["idCaja"], { unique: true })
@Entity("Caja_Configuracion", { schema: "dbo" })
export class CajaConfiguracion {
  @PrimaryGeneratedColumn({ type: "bigint", name: "IdCaja" })
  idCaja: string;

  @Column("nvarchar", { name: "IP", length: 20 })
  ip: string;

  @Column("nvarchar", { name: "SN", length: 50 })
  sn: string;

  @Column("int", { name: "IdUnidad" })
  idUnidad: number;
}
