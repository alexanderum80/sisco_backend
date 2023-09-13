import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IConciliaReporteClasificador {
  @Field({ name: 'Cuenta' })
  cuenta: string;

  @Field({ name: 'SubCuenta' })
  subcuenta: string;

  @Field({ name: 'Descripcion' })
  descripcion: string;

  @Field({ name: 'Crt1Clasif', nullable: true })
  crt1_clasif?: string;

  @Field({ name: 'Crt2Clasif', nullable: true })
  crt2_clasif?: string;

  @Field({ name: 'Crt3Clasif', nullable: true })
  crt3_clasif?: string;

  @Field({ name: 'Crt4Clasif', nullable: true })
  crt4_clasif?: string;

  @Field({ name: 'Crt5Clasif', nullable: true })
  crt5_clasif?: string;

  @Field({ name: 'NatClasif', nullable: true })
  nat_clasif?: string;

  @Field({ name: 'OblClasif', nullable: true })
  obl_clasif?: boolean;

  @Field({ name: '', nullable: true })
  grupo_clasif?: string;

  @Field({ name: '', nullable: true })
  clase_clasif?: string;

  @Field({ name: '', nullable: true })
  categ_clasif?: string;

  @Field({ name: '', nullable: true })
  clasif_clasif?: string;

  @Field({ name: '', nullable: true })
  tipo_clasif?: string;

  @Field({ name: '', nullable: true })
  estado_clasif?: string;

  @Field({ name: 'Crt1Rodas', nullable: true })
  crt1_rodas?: string;

  @Field({ name: 'Crt2Rodas', nullable: true })
  crt2_rodas?: string;

  @Field({ name: 'Crt3Rodas', nullable: true })
  crt3_rodas?: string;

  @Field({ name: 'Crt4Rodas', nullable: true })
  crt4_rodas?: string;

  @Field({ name: 'Crt5Rodas', nullable: true })
  crt5_rodas?: string;

  @Field({ name: 'NatRodas', nullable: true })
  nat_rodas?: string;

  @Field({ name: 'OblRodas', nullable: true })
  obl_rodas?: boolean;

  @Field({ name: '', nullable: true })
  grupo_rodas?: string;

  @Field({ name: '', nullable: true })
  clase_rodas?: string;

  @Field({ name: '', nullable: true })
  categ_rodas?: string;

  @Field({ name: '', nullable: true })
  clasif_rodas?: string;

  @Field({ name: '', nullable: true })
  tipo_rodas?: string;

  @Field({ name: '', nullable: true })
  estado_rodas?: string;
}

@ObjectType()
export class IConciliaReporteConsulta {
  @Field({ name: 'Periodo' })
  periodo: number;

  @Field({ name: 'Centro' })
  centro: string;

  @Field({ name: 'IdConsulta' })
  id_consulta: string;

  @Field({ name: 'Consulta' })
  consulta: string;

  @Field({ name: 'Cuenta', nullable: true })
  cuenta?: string;

  @Field({ name: 'SubCuenta', nullable: true })
  subcuenta?: string;

  @Field({ name: 'Analisis1', nullable: true })
  analisis_1?: string;

  @Field({ name: 'Analisis2', nullable: true })
  analisis_2?: string;

  @Field({ name: 'Analisis3', nullable: true })
  analisis_3?: string;

  @Field({ name: 'Analisis4', nullable: true })
  analisis_4?: string;

  @Field({ name: 'Analisis5', nullable: true })
  analisis_5?: string;

  @Field({ name: 'Total' })
  total: number;

  @Field({ name: 'Consolidado' })
  consolidado: boolean;
}

@ObjectType()
export class IConciliaReporteExpresiones {
  @Field({ name: 'Centro' })
  centro: number;

  @Field({ name: 'Consolidado' })
  consolidado: boolean;

  @Field({ name: 'Periodo' })
  periodo: number;

  @Field({ name: 'Expresion' })
  expresion: string;

  @Field({ name: 'Valor' })
  valor: number;

  @Field({ name: 'Operador' })
  operador: string;

  @Field({ name: 'ExpresionC' })
  expresionc: string;

  @Field({ name: 'ValorC' })
  valorc: number;

  @Field({ name: 'Resultado' })
  resultado: string;
}

@ObjectType()
export class IConciliaReporteValores {
  @Field({ name: 'Centro' })
  centro: string;

  @Field({ name: 'Periodo' })
  periodo: number;

  @Field({ name: 'Consolidado' })
  consolidado: boolean;

  @Field({ name: 'Expresion' })
  expresion: string;

  @Field({ name: 'Valor' })
  valor: number;

  @Field({ name: 'Operador' })
  operador: string;

  @Field({ name: 'ValorRodas' })
  valor_rodas: number;

  @Field({ name: 'Estado' })
  estado: string;

  @Field({ name: 'Division' })
  division: string;
}

@ObjectType()
export class IConciliaCuadreSistemas {
  @Field({ name: 'Centro' })
  centro: number;

  @Field({ name: 'Sistema' })
  sistema: string;

  @Field({ name: 'Estado' })
  estado: string;
}

@ObjectType()
export class IConciliaInformacionContabilidad {
  @Field({ name: 'Criterio' })
  criterio: string;

  @Field({ name: 'Saldo' })
  saldo: number;
}

@ObjectType()
export class ConciliaContaQueryResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  data?: string;

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class ConciliaContabilidadQueryResponse {
  @Field(() => [IConciliaReporteClasificador])
  ReporteClasificador: IConciliaReporteClasificador[];

  @Field(() => [IConciliaReporteConsulta])
  ReporteConsultas: IConciliaReporteConsulta[];

  @Field(() => [IConciliaReporteExpresiones])
  ReporteExpresiones: IConciliaReporteExpresiones[];

  @Field(() => [IConciliaReporteValores])
  ReporteValores: IConciliaReporteValores[];

  @Field(() => [IConciliaCuadreSistemas])
  CuadreSistemas: IConciliaCuadreSistemas[];

  @Field(() => [IConciliaInformacionContabilidad])
  Informacion: IConciliaInformacionContabilidad[];
}

@ObjectType()
export class IChequeoCentroVsConsolidado {
  @Field({ name: 'Centro' })
  centro: string;

  @Field({ name: 'Unidad' })
  unidad: string;

  @Field({ name: 'Consolidado' })
  consolidado: boolean;

  @Field({ name: 'Periodo' })
  periodo: number;

  @Field({ name: 'IdConsulta' })
  id_consulta: string;

  @Field({ name: 'Consulta' })
  consulta: string;

  @Field({ name: 'Cuenta', nullable: true })
  cuenta?: string;

  @Field({ name: 'SubCuenta', nullable: true })
  subcuenta?: string;

  @Field({ name: 'Analisis1', nullable: true })
  analisis_1?: string;

  @Field({ name: 'Analisis2', nullable: true })
  analisis_2?: string;

  @Field({ name: 'Analisis3', nullable: true })
  analisis_3?: string;

  @Field({ name: 'Analisis4', nullable: true })
  analisis_4?: string;

  @Field({ name: 'Analisis5', nullable: true })
  analisis_5?: string;

  @Field({ name: 'Total' })
  total: number;
}

// utilitarios para el rodas
export const queryUltimoPeriodo = `SELECT COALESCE(MAX(Periodo), -1) as Periodo 
  FROM conta_asiento
  WHERE Centro = @Centro and COALESCE(Consolidado, false) = @Cons and Anno = @Anio`;

export const queryRangoAsientosMesRodas = `SELECT periodo, min(id) as ini, max(id) as fin
  FROM contabilidad.asientos as a inner join contabilidad.comprobantes as c on a.anno_comprobante = c.anno and 
      a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero
  group by periodo
  order by periodo;`;

export const queryClasificadorCuentasRodas = `SELECT anno, cuenta, subcuenta, nombre, naturaleza, tipo_analisis_1, tipo_analisis_2, tipo_analisis_3, tipo_analisis_4, tipo_analisis_5, 
  obligacion, tipo_moneda, grupo, clase, categoria, clasificacion, tipo, estado
  from contabilidad.cuentas
  where anno = @anno
  order by anno asc, cuenta asc, subcuenta asc`;

export const queryAsientoRodas = `SELECT a.anno_comprobante as anno, c.periodo, a.cuenta, a.subcuenta, coalesce(a.tipo_analisis_1, '') as tipo_analisis_1, coalesce(a.analisis_1, '') as analisis_1, coalesce(a.tipo_analisis_2, '') as tipo_analisis_2, coalesce(a.analisis_2, '') as analisis_2, coalesce(a.tipo_analisis_3, '') as tipo_analisis_3, coalesce(a.analisis_3, '') as analisis_3, coalesce(a.tipo_analisis_4, '') as tipo_analisis_4, coalesce(a.analisis_4, '') as analisis_4, coalesce(a.tipo_analisis_5, '') as tipo_analisis_5, coalesce(a.analisis_5, '') as analisis_5,
  sum(a.debito) as debito, sum(a.credito) as credito
  FROM contabilidad.asientos as a inner join 
    contabilidad.comprobantes as c on a.anno_comprobante = c.anno and a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero
  where a.anno_comprobante = @anno and c.periodo = @periodo and c.estado <> 'I' and c.tipo <> '_UH'
  group by a.anno_comprobante, c.periodo, a.cuenta, a.subcuenta, coalesce(a.tipo_analisis_1, ''), coalesce(a.analisis_1, ''), coalesce(a.tipo_analisis_2, ''), coalesce(a.analisis_2, ''), coalesce(a.tipo_analisis_3, ''), coalesce(a.analisis_3, ''), coalesce(a.tipo_analisis_4, ''), coalesce(a.analisis_4, ''), coalesce(a.tipo_analisis_5, ''), coalesce(a.analisis_5, '');`;

export const queryObligacionesRodas = `SELECT a.anno_comprobante, c.periodo, a.cuenta, a.subcuenta, coalesce(a.tipo_analisis_1, '') as tipo_analisis_1, coalesce(a.analisis_1, '') as analisis_1, coalesce(a.tipo_analisis_2, '') as tipo_analisis_2, coalesce(a.analisis_2, '') as analisis_2, coalesce(a.tipo_analisis_3, '') as tipo_analisis_3, coalesce(a.analisis_3, '') as analisis_3, coalesce(a.tipo_analisis_4, '') as tipo_analisis_4, coalesce(a.analisis_4, '') as analisis_4, coalesce(a.tipo_analisis_5, '') as tipo_analisis_5, coalesce(a.analisis_5, '') as analisis_5,
  sum(a.debito) as debito, sum(a.credito) as credito, a.documento_obligacion, min(a.fecha_documento_obligacion) as fecha_documento_obligacion
  FROM contabilidad.asientos as a inner join 
    contabilidad.comprobantes as c on a.anno_comprobante = c.anno and a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero inner join 
    contabilidad.cuentas cta on cta.anno = a.anno_comprobante and cta.cuenta = a.cuenta and cta.subcuenta = a.subcuenta 
  where a.anno_comprobante = @anno and c.periodo = @periodo and c.estado <> 'I' and cta.obligacion = true and c.tipo <> '_UH'
  group by a.anno_comprobante, c.periodo, a.cuenta, a.subcuenta, coalesce(a.tipo_analisis_1, ''), coalesce(a.analisis_1, ''), coalesce(a.tipo_analisis_2, ''), coalesce(a.analisis_2, ''), coalesce(a.tipo_analisis_3, ''), coalesce(a.analisis_3, ''), coalesce(a.tipo_analisis_4, ''), coalesce(a.analisis_4, ''), coalesce(a.tipo_analisis_5, ''), coalesce(a.analisis_5, ''), a.documento_obligacion;`;

export const querySaldosAcumuladosRodas = `SELECT COALESCE(ROUND(SUM(ROUND(a.debito, 2)), 2), 0) AS debito, COALESCE(ROUND(SUM(ROUND(a.credito, 2)), 2), 0) AS credito
  FROM contabilidad.asientos as a inner join contabilidad.comprobantes as c on a.anno_comprobante = c.anno and 
    a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero and c.estado <> 'I' and c.tipo <> '_UH'
  where a.anno_comprobante = @anno and c.periodo < @periodo;`;

// querys para los reportes de la conciliación
export const queryReporteConsultas = `SELECT Periodo, Centro, Id_Consulta, Consulta, Cuenta, SubCuenta, Analisis_1, Analisis_2, Analisis_3, Analisis_4, Analisis_5, SUM(Total) AS Total, Consolidado
  FROM Conta_Reporte_Consultas
  WHERE (Consolidado = @Consolidado) AND (Centro = @Centro) AND (Anno = @Anio) AND (Periodo = @Periodo) AND (Id_Consulta = @IdConsulta)
  GROUP BY Periodo, Centro, Id_Consulta, Consulta, Cuenta, SubCuenta, Analisis_1, Analisis_2, Analisis_3, Analisis_4, Analisis_5, Consolidado
  order by periodo, centro, consulta, cuenta, subcuenta, analisis_1, analisis_2, analisis_3, analisis_4, analisis_5;`;

export const queryReporteExpresiones = `SELECT Centro, Consolidado, Periodo, Expresion, Valor, Operador, ExpresionC, ValorC, Resultado
  FROM Conta_Reporte_Expresiones
  WHERE (Centro = @Centro) AND (coalesce(Consolidado, false) = @Consolidado) AND (Anno = @Anio) AND (Periodo = @Periodo)
  order by centro, Consolidado, Periodo, Expresion, ExpresionC;`;

export const queryReporteValores = `SELECT Centro, Periodo, Consolidado, Expresion, Valor, Operador, Valor_Rodas, Estado, Division
  FROM Conta_Reporte_Valor 
  WHERE (Centro = @Centro) AND (coalesce(Consolidado, false) = @Consolidado) AND (Anno = @Anio) AND (Periodo = @Periodo) AND (Division = @IdDivision);`;

// query para actualizar el clasificador de cuentas en el rodas
export const queryUpdateClasificadorRodas = `WITH updclas as (
  UPDATE contabilidad.cuentas
    SET anno = @Anio, cuenta = '@Cta', subcuenta = '@SubCta', nombre = '@Nombre', naturaleza = '@Nat', tipo_analisis_1 = @An1, tipo_analisis_2 = @An2, tipo_analisis_3 = @An3, tipo_analisis_4 = @An4, tipo_analisis_5 = @An5,
      obligacion = '@Obl', grupo = '@Grupo', clase = '@Clase', categoria = '@Categ', clasificacion = '@Clasif', tipo = '@Tipo', estado = '@Estado'
    WHERE anno = @Anio AND cuenta = '@Cta' AND subcuenta = '@SubCta'
  RETURNING *)	
  INSERT INTO contabilidad.cuentas(
      anno, cuenta, subcuenta, nombre, naturaleza, tipo_analisis_1, tipo_analisis_2, tipo_analisis_3, tipo_analisis_4, tipo_analisis_5, obligacion, grupo, clase, categoria, clasificacion, tipo, estado)
    SELECT @Anio, '@Cta', '@SubCta', '@Nombre', '@Nat', @An1, @An2, @An3, @An4, @An5, @Obl, '@Grupo', '@Clase', '@Categ', '@Clasif', '@Tipo', '@Estado' 
    WHERE NOT EXISTS (select * from updclas)`;

export const queryUpdateCriterioClasificadorRodas = `WITH updversus as (
  UPDATE contabilidad.cuentas_versus
    SET tipo_analisis_1_consolidacion = @TipoAn1Cons, analisis_1_consolidacion = @An1Cons, tipo_analisis_2_consolidacion = @TipoAn2Cons, analisis_2_consolidacion = @An2Cons, tipo_analisis_3_consolidacion = @TipoAn3Cons, analisis_3_consolidacion = @An3Cons, tipo_analisis_4_consolidacion = @TipoAn4Cons, analisis_4_consolidacion = @An4Cons, tipo_analisis_5_consolidacion = @TipoAn5Cons, analisis_5_consolidacion = @An5Cons
    WHERE cuenta = '@Cta' AND subcuenta = '@SubCta'
    RETURNING *
  )
  INSERT INTO contabilidad.cuentas_versus (modo, origen, cuenta, subcuenta, cuenta_consolidacion, subcuenta_consolidacion, tipo_analisis_1_consolidacion, analisis_1_consolidacion, tipo_analisis_2_consolidacion, analisis_2_consolidacion, tipo_analisis_3_consolidacion, analisis_3_consolidacion, tipo_analisis_4_consolidacion, analisis_4_consolidacion, tipo_analisis_5_consolidacion, analisis_5_consolidacion)
  SELECT 'I', 'C', '@Cta', '@SubCta', '@Cta', '@SubCta', @TipoAn1Cons, @An1Cons, @TipoAn2Cons, @An2Cons, @TipoAn3Cons, @An3Cons, @TipoAn4Cons, @An4Cons, @TipoAn5Cons, @An5Cons
    WHERE NOT EXISTS (select * FROM updversus);`;
