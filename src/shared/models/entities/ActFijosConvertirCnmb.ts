import { Column, Entity } from "typeorm";

@Entity("ActFijos_ConvertirCNMB", { schema: "dbo" })
export class ActFijosConvertirCnmb {
  @Column("nvarchar", { name: "CNMB_New", nullable: true, length: 10 })
  cnmbNew: string | null;

  @Column("nvarchar", { name: "CNMB_Old", nullable: true, length: 10 })
  cnmbOld: string | null;
}
