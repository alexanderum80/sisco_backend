import { Column, Entity } from "typeorm";

@Entity("tmpClanaCNMB", { schema: "dbo" })
export class TmpClanaCnmb {
  @Column("nvarchar", { name: "IdUnidad", length: 3 })
  idUnidad: string;

  @Column("nvarchar", { name: "CNMB", length: 10 })
  cnmb: string;

  @Column("nvarchar", { name: "DCNMB", length: 40 })
  dcnmb: string;

  @Column("float", { name: "TREPO", precision: 53 })
  trepo: number;
}
