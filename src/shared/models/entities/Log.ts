import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Log", ["idLog"], { unique: true })
@Entity("Log", { schema: "dbo" })
export class Log {
  @PrimaryGeneratedColumn({ type: "int", name: "IdLog" })
  idLog: number;

  @Column("nvarchar", { name: "Operacion", nullable: true, length: 100 })
  operacion: string | null;

  @Column("nchar", { name: "Centro", length: 3 })
  centro: string;

  @Column("datetime", { name: "Fecha", nullable: true })
  fecha: Date | null;

  @Column("nchar", { name: "Usuairo", length: 50 })
  usuairo: string;

  @Column("nvarchar", { name: "Tipo", nullable: true, length: 50 })
  tipo: string | null;

  @Column("nvarchar", { name: "Version", length: 10 })
  version: string;

  @Column("nvarchar", { name: "VersionContable", nullable: true, length: 10 })
  versionContable: string | null;

  @Column("nvarchar", { name: "VersionGolden", nullable: true, length: 10 })
  versionGolden: string | null;

  @Column("nvarchar", { name: "VersionNomina", nullable: true, length: 10 })
  versionNomina: string | null;

  @Column("nvarchar", { name: "VersionParte", nullable: true, length: 10 })
  versionParte: string | null;

  @Column("nvarchar", { name: "VersionAFT", nullable: true, length: 10 })
  versionAft: string | null;

  @Column("nvarchar", { name: "VersionUtil", nullable: true, length: 10 })
  versionUtil: string | null;

  @Column("nvarchar", { name: "VersionCashFlow", nullable: true, length: 10 })
  versionCashFlow: string | null;

  @Column("nvarchar", { name: "VersionCintas", nullable: true, length: 10 })
  versionCintas: string | null;

  @Column("bit", { name: "ClasificadorEmitido", nullable: true })
  clasificadorEmitido: boolean | null;

  @Column("datetime", { name: "FechaClasificador", nullable: true })
  fechaClasificador: Date | null;
}
