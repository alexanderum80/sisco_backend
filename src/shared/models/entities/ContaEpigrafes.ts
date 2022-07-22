import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Conta_Epigrafes", ["idEpigafre"], { unique: true })
@Entity("Conta_Epigrafes", { schema: "dbo" })
export class ContaEpigrafes {
  @PrimaryGeneratedColumn({ type: "int", name: "IdEpigafre" })
  idEpigafre: number;

  @Column("nvarchar", { name: "Epigrafe", length: 100 })
  epigrafe: string;
}
