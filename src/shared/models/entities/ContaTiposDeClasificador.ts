import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_TiposDeClasificador", ["idTipo"], { unique: true })
@Entity("Conta_TiposDeClasificador", { schema: "dbo" })
export class ContaTiposDeClasificador {
  @PrimaryGeneratedColumn({ type: "int", name: "IdTipo" })
  idTipo: number;

  @Column("nchar", { name: "TipoClasificador", length: 20 })
  tipoClasificador: string;
}
