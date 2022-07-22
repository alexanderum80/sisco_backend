import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Caja_Cinta", { schema: "dbo" })
export class CajaCinta {
  @Column("nvarchar", { name: "Fecha", nullable: true, length: 10 })
  fecha: string | null;

  @Column("int", { name: "IdOperacion" })
  idOperacion: number;

  @Column("nvarchar", { name: "P1", nullable: true, length: 255 })
  p1: string | null;

  @Column("nvarchar", { name: "P2", nullable: true, length: 255 })
  p2: string | null;

  @Column("nvarchar", { name: "P3", nullable: true, length: 255 })
  p3: string | null;

  @Column("nvarchar", { name: "P4", nullable: true, length: 255 })
  p4: string | null;

  @Column("nvarchar", { name: "P5", nullable: true, length: 255 })
  p5: string | null;

  @Column("nvarchar", { name: "P6", nullable: true, length: 255 })
  p6: string | null;

  @Column("nvarchar", { name: "P7", nullable: true, length: 255 })
  p7: string | null;

  @Column("nvarchar", { name: "P8", nullable: true, length: 255 })
  p8: string | null;

  @Column("nvarchar", { name: "P9", nullable: true, length: 255 })
  p9: string | null;

  @Column("nvarchar", { name: "P10", nullable: true, length: 255 })
  p10: string | null;

  @Column("nvarchar", { name: "P11", nullable: true, length: 255 })
  p11: string | null;

  @Column("nvarchar", { name: "P12", nullable: true, length: 255 })
  p12: string | null;

  @Column("int", { name: "IdTipoCaja" })
  idTipoCaja: number;

  @Column("nvarchar", { name: "P13", nullable: true, length: 255 })
  p13: string | null;

  @Column("nvarchar", { name: "P14", nullable: true, length: 255 })
  p14: string | null;

  @Column("nvarchar", { name: "P15", nullable: true, length: 255 })
  p15: string | null;

  @Column("nvarchar", { name: "P16", nullable: true, length: 255 })
  p16: string | null;

  @Column("nvarchar", { name: "P17", nullable: true, length: 255 })
  p17: string | null;

  @Column("nvarchar", { name: "P18", nullable: true, length: 255 })
  p18: string | null;

  @Column("nvarchar", { name: "P19", nullable: true, length: 255 })
  p19: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;
}
