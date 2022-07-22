import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Caja_Correcciones", { schema: "dbo" })
export class CajaCorrecciones {
  @Column("nchar", { name: "TipoLinea", nullable: true, length: 255 })
  tipoLinea: string | null;

  @Column("nchar", { name: "Fecha", nullable: true, length: 10 })
  fecha: string | null;

  @Column("nchar", { name: "Hora", nullable: true, length: 15 })
  hora: string | null;

  @Column("nvarchar", { name: "Descripcion", nullable: true, length: 255 })
  descripcion: string | null;

  @Column("nvarchar", { name: "Descripcion1", nullable: true, length: 255 })
  descripcion1: string | null;

  @Column("nchar", { name: "Cantidad", nullable: true, length: 6 })
  cantidad: string | null;

  @Column("money", { name: "Importe", nullable: true })
  importe: number | null;

  @Column("nvarchar", { name: "NºOperacion", nullable: true, length: 255 })
  nOperacion: string | null;

  @Column("int", { name: "idTipoCaja", nullable: true })
  idTipoCaja: number | null;

  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "Usuario", nullable: true, length: 20 })
  usuario: string | null;
}
