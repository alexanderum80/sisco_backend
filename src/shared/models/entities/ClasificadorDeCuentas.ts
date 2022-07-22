import { Column, Entity, Index } from "typeorm";

@Index(
  "PK_Clasificador_de_Cuentas1",
  ["centro", "consolidado", "aO", "cuenta", "subCuenta"],
  { unique: true }
)
@Entity("Clasificador_de_Cuentas", { schema: "dbo" })
export class ClasificadorDeCuentas {
  @Column("int", { primary: true, name: "Centro" })
  centro: number;

  @Column("bit", { primary: true, name: "Consolidado", default: () => "(0)" })
  consolidado: boolean;

  @Column("int", { primary: true, name: "Año" })
  aO: number;

  @Column("nvarchar", { primary: true, name: "Cuenta", length: 8 })
  cuenta: string;

  @Column("nvarchar", { primary: true, name: "SubCuenta", length: 8 })
  subCuenta: string;

  @Column("nvarchar", { name: "Descripción", nullable: true, length: 60 })
  descripciN: string | null;

  @Column("nchar", { name: "Naturaleza", nullable: true, length: 1 })
  naturaleza: string | null;

  @Column("nchar", { name: "Grupo_Clase", nullable: true, length: 2 })
  grupoClase: string | null;

  @Column("bit", { name: "SubMayor", nullable: true })
  subMayor: boolean | null;

  @Column("nchar", { name: "Tipo_de_Análisis_1", nullable: true, length: 1 })
  tipoDeAnLisis_1: string | null;

  @Column("nchar", { name: "Tipo_de_Análisis_2", nullable: true, length: 1 })
  tipoDeAnLisis_2: string | null;

  @Column("nchar", { name: "Tipo_de_Análisis_3", nullable: true, length: 1 })
  tipoDeAnLisis_3: string | null;

  @Column("bit", { name: "Obligación", nullable: true })
  obligaciN: boolean | null;

  @Column("bit", { name: "Terminal", nullable: true })
  terminal: boolean | null;

  @Column("bit", { name: "Real", nullable: true })
  real: boolean | null;

  @Column("nvarchar", {
    name: "Cuenta_Contrapartida",
    nullable: true,
    length: 8,
  })
  cuentaContrapartida: string | null;

  @Column("nvarchar", {
    name: "SubCuenta_Contrapartida",
    nullable: true,
    length: 8,
  })
  subCuentaContrapartida: string | null;

  @Column("nvarchar", {
    name: "Cuenta_Consolidación",
    nullable: true,
    length: 8,
  })
  cuentaConsolidaciN: string | null;

  @Column("nvarchar", {
    name: "SubCuenta_Consolidación",
    nullable: true,
    length: 8,
  })
  subCuentaConsolidaciN: string | null;

  @Column("nchar", {
    name: "Tipo_de_Análisis_1_Consolidación",
    nullable: true,
    length: 1,
  })
  tipoDeAnLisis_1ConsolidaciN: string | null;

  @Column("nchar", {
    name: "Tipo_de_Análisis_2_Consolidación",
    nullable: true,
    length: 1,
  })
  tipoDeAnLisis_2ConsolidaciN: string | null;

  @Column("nchar", {
    name: "Tipo_de_Análisis_3_Consolidación",
    nullable: true,
    length: 1,
  })
  tipoDeAnLisis_3ConsolidaciN: string | null;

  @Column("nchar", {
    name: "Obligación_Consolidación",
    nullable: true,
    length: 1,
  })
  obligaciNConsolidaciN: string | null;

  @Column("nchar", {
    name: "Condición_Consolidación",
    nullable: true,
    length: 1,
  })
  condiciNConsolidaciN: string | null;

  @Column("nvarchar", { name: "Cuenta_Ganancia", nullable: true, length: 8 })
  cuentaGanancia: string | null;

  @Column("nvarchar", { name: "SubCuenta_Ganancia", nullable: true, length: 8 })
  subCuentaGanancia: string | null;

  @Column("nvarchar", { name: "Cuenta_Pérdida", nullable: true, length: 8 })
  cuentaPRdida: string | null;

  @Column("nvarchar", { name: "SubCuenta_Pérdida", nullable: true, length: 8 })
  subCuentaPRdida: string | null;

  @Column("bit", { name: "Moneda_Extranjera", nullable: true })
  monedaExtranjera: boolean | null;

  @Column("nchar", { name: "Estado", nullable: true, length: 1 })
  estado: string | null;

  @Column("nvarchar", { name: "Cuenta_Conversión", nullable: true, length: 8 })
  cuentaConversiN: string | null;

  @Column("nvarchar", {
    name: "SubCuenta_Conversión",
    nullable: true,
    length: 8,
  })
  subCuentaConversiN: string | null;

  @Column("nchar", {
    name: "Tipo_de_Análisis_1_Conversión",
    nullable: true,
    length: 1,
  })
  tipoDeAnLisis_1ConversiN: string | null;

  @Column("nchar", {
    name: "Tipo_de_Análisis_2_Conversión",
    nullable: true,
    length: 1,
  })
  tipoDeAnLisis_2ConversiN: string | null;

  @Column("nchar", {
    name: "Tipo_de_Análisis_3_Conversión",
    nullable: true,
    length: 1,
  })
  tipoDeAnLisis_3ConversiN: string | null;

  @Column("nchar", { name: "Obligación_Conversión", nullable: true, length: 1 })
  obligaciNConversiN: string | null;

  @Column("nvarchar", {
    name: "Descripción_Conversión",
    nullable: true,
    length: 60,
  })
  descripciNConversiN: string | null;

  @Column("nchar", { name: "Naturaleza_Conversión", nullable: true, length: 1 })
  naturalezaConversiN: string | null;

  @Column("bit", { name: "Terminal_Conversión", nullable: true })
  terminalConversiN: boolean | null;

  @Column("bit", { name: "Moneda_Extranjera_Conversión", nullable: true })
  monedaExtranjeraConversiN: boolean | null;

  @Column("nvarchar", {
    name: "Análisis_1_Consolidación",
    nullable: true,
    length: 10,
  })
  anLisis_1ConsolidaciN: string | null;

  @Column("nvarchar", {
    name: "Análisis_2_Consolidación",
    nullable: true,
    length: 10,
  })
  anLisis_2ConsolidaciN: string | null;

  @Column("nvarchar", {
    name: "Análisis_3_Consolidación",
    nullable: true,
    length: 10,
  })
  anLisis_3ConsolidaciN: string | null;

  @Column("bit", { name: "aporta_presupuesto", nullable: true })
  aportaPresupuesto: boolean | null;

  @Column("bit", { name: "gasto_presupuesto", nullable: true })
  gastoPresupuesto: boolean | null;

  @Column("bit", { name: "ingreso_presupuesto", nullable: true })
  ingresoPresupuesto: boolean | null;

  @Column("bit", { name: "Resultados_presupuesto", nullable: true })
  resultadosPresupuesto: boolean | null;

  @Column("bit", { name: "Capital_presupuesto", nullable: true })
  capitalPresupuesto: boolean | null;

  @Column("bit", { name: "MEMO" })
  memo: boolean;

  @Column("nvarchar", { name: "Saldo", nullable: true, length: 250 })
  saldo: string | null;

  @Column("nvarchar", { name: "periodo", nullable: true, length: 50 })
  periodo: string | null;

  @Column("smallint", { name: "Campo", nullable: true })
  campo: number | null;
}
