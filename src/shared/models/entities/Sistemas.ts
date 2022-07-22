import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Sistemas", ["idSistema"], { unique: true })
@Entity("Sistemas", { schema: "dbo" })
export class Sistemas {
  @PrimaryGeneratedColumn({ type: "int", name: "IdSistema" })
  idSistema: number;

  @Column("nchar", { name: "Sistema", nullable: true, length: 10 })
  sistema: string | null;

  @Column("nvarchar", { name: "Conexion", nullable: true })
  conexion: string | null;
}
