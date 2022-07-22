import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_CajaOtrasOperaciones", ["id"], { unique: true })
@Entity("Caja_OtrasOperaciones", { schema: "dbo" })
export class CajaOtrasOperaciones {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "Operacion", nullable: true, length: 255 })
  operacion: string | null;

  @Column("nvarchar", { name: "Fecha", nullable: true, length: 20 })
  fecha: string | null;

  @Column("nvarchar", { name: "Usuario", nullable: true, length: 20 })
  usuario: string | null;

  @Column("nvarchar", { name: "NoOperacion", nullable: true, length: 10 })
  noOperacion: string | null;
}
