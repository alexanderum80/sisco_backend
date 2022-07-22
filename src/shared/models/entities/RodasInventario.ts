import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Rodas_Inventario", ["id"], { unique: true })
@Entity("Rodas_Inventario", { schema: "dbo" })
export class RodasInventario {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "IdCentro" })
  idCentro: number;

  @Column("int", { name: "IdUnidad" })
  idUnidad: number;

  @Column("nvarchar", { name: "IdPiso", length: 5 })
  idPiso: string;

  @Column("int", { name: "Periodo" })
  periodo: number;

  @Column("nchar", { name: "Cuenta", length: 10 })
  cuenta: string;

  @Column("nchar", { name: "SubCuenta", length: 10 })
  subCuenta: string;

  @Column("nchar", { name: "Crt1", length: 10 })
  crt1: string;

  @Column("nchar", { name: "Crt2", length: 10 })
  crt2: string;

  @Column("nchar", { name: "Crt3", length: 10 })
  crt3: string;

  @Column("decimal", { name: "Saldo", precision: 18, scale: 4 })
  saldo: number;
}
