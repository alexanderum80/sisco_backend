import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Conta_TipoDato", ["idTipoDato"], { unique: true })
@Entity("Conta_TipoDato", { schema: "dbo" })
export class ContaTipoDato {
  @PrimaryGeneratedColumn({ type: "int", name: "IdTipoDato" })
  idTipoDato: number;

  @Column("nchar", { name: "TipoDato", length: 10 })
  tipoDato: string;
}
