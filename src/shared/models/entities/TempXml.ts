import { Column, Entity } from "typeorm";

@Entity("TempXML", { schema: "dbo" })
export class TempXml {
  @Column("xml", { name: "XML_Data" })
  xmlData: string;
}
