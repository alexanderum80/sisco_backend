import { Column, Entity, Index } from "typeorm";

@Index("PK_ActFijos_ClasificadorCNMB", ["cnmb"], { unique: true })
@Entity("ActFijos_ClasificadorCNMB", { schema: "dbo" })
export class ActFijosClasificadorCnmb {
  @Column("nvarchar", { primary: true, name: "CNMB", length: 10 })
  cnmb: string;

  @Column("nvarchar", { name: "DCNMB", length: 40 })
  dcnmb: string;

  @Column("float", { name: "TREPO", precision: 53 })
  trepo: number;
}
