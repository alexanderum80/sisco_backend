import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_TipoEntidades", ["id"], { unique: true })
@Entity("Conta_TipoEntidades", { schema: "dbo" })
export class ContaTipoEntidades {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "Entidades", nullable: true, length: 255 })
  entidades: string | null;

  @Column("nvarchar", { name: "Descripcion", nullable: true, length: 255 })
  descripcion: string | null;
}
