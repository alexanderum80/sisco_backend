import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

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
export class ConciliaContabilidad {
  @Field(() => ConciliaContaQueryResponse)
  ReporteClasificador: ConciliaContaQueryResponse;

  @Field(() => ConciliaContaQueryResponse)
  ReporteConsultas: ConciliaContaQueryResponse;

  @Field(() => ConciliaContaQueryResponse)
  ReporteExpresiones: ConciliaContaQueryResponse;

  @Field(() => ConciliaContaQueryResponse)
  ReporteValores: ConciliaContaQueryResponse;

  @Field(() => ConciliaContaQueryResponse)
  CuadreSistemas: ConciliaContaQueryResponse;
}

@ObjectType()
export class ConciliaContabilidadQueryResponse {
  @Field()
  success: boolean;

  @Field(() => ConciliaContabilidad, { nullable: true })
  data?: ConciliaContabilidad;

  @Field(() => String, { nullable: true })
  error?: string;
}

@InputType()
export class ConciliaContaInput {
  @Field()
  idCentro: number;

  @Field()
  periodo: number;

  @Field()
  annio: number;

  @Field()
  tipoCentro: number;

  @Field()
  tipoEntidad: number;
}

@InputType()
export class IniciarSaldosInput {
  @Field()
  idCentro: number;

  @Field()
  consolidado: boolean;

  @Field()
  annio: number;
}

@InputType()
export class ChequearCentrosInput {
  @Field()
  idCentro: number;

  @Field()
  annio: number;

  @Field()
  periodo: number;

  @Field(() => [Int])
  centrosAChequear: number[];
}

export const queryUltimoPeriodo = `SELECT ISNULL(MAX(Periodo), -1) as Periodo 
    FROM dbo.Conta_Comprobantes
    WHERE Centro = @Centro and isnull(Consolidado, 0) = @Cons and Anno = @Anio`;

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

export const queryComprobantesRodas = `SELECT anno, tipo, numero, periodo, estado, descripcion, to_char(fecha_hora, 'YYYY/MM/DD HH12:MI:SS') as fecha_hora, usuario, to_char(fecha_hora_actualizacion, 'YYYY/MM/DD HH12:MI:SS') as fecha_hora_actualizacion, usuario_actualizacion, to_char(fecha_hora_traspaso, 'YYYY/MM/DD HH12:MI:SS') as fecha_hora_traspaso, usuario_traspaso, modo, origen, entidad, tipo_, numero_, archivo, debito, credito
    FROM contabilidad.comprobantes
    where anno = @anno and periodo = @periodo;`;

export const queryAsientoRodas = `SELECT a.anno_comprobante, a.tipo_comprobante, a.numero_comprobante, a.tipo_documento, a.documento, a.id, a.cuenta, a.subcuenta, a.tipo_analisis_1, a.analisis_1, a.tipo_analisis_2, a.analisis_2, a.tipo_analisis_3, a.analisis_3, a.tipo_analisis_4, a.analisis_4, a.tipo_analisis_5, a.analisis_5, a.naturaleza, a.debito, a.credito, a.tipo_moneda, a.tasa_cambio, a.debito_moneda, a.credito_moneda, a.tipo_documento_obligacion, a.documento_obligacion, to_char(a.fecha_documento_obligacion, 'YYYY/MM/DD HH12:MI:SS') as fecha_documento_obligacion, a.detalle, to_char(a.fecha_compromiso_documento_obligacion, 'YYYY/MM/DD HH12:MI:SS') as fecha_compromiso_documento_obligacion, a.codigo_almacen
    FROM contabilidad.asientos as a inner join contabilidad.comprobantes as c on a.anno_comprobante = c.anno and 
        a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero
    where a.anno_comprobante = @anno and c.periodo = @periodo;`;

export const querySaldosAcumuladosRodas = `SELECT COALESCE(ROUND(SUM(ROUND(a.debito, 2)), 2), 0) AS debito, COALESCE(ROUND(SUM(ROUND(a.credito, 2)), 2), 0) AS credito
    FROM contabilidad.asientos as a inner join contabilidad.comprobantes as c on a.anno_comprobante = c.anno and 
        a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero
        where a.anno_comprobante = @anno and c.periodo < @periodo;`;

export const queryReporteConsultas = `SELECT Periodo, Centro, IdConsulta, Consulta, Cuenta, SubCuenta, [Analisis_1] as Analisis1, [Analisis_2] as Analisis2, [Analisis_3] as Analisis3, [Analisis_4] as Analisis4, [Analisis_5] as Analisis5, SUM(Total) AS Total, Consolidado
    FROM Conta_ReporteConsultas
    WHERE (Consolidado = @Consolidado) AND (Centro = @Centro) AND (Periodo = @Periodo) AND (IdConsulta = @IdConsulta)
    GROUP BY Periodo, Centro, IdConsulta, Consulta, Cuenta, SubCuenta, [Analisis_1], [Analisis_2], [Analisis_3], [Analisis_4], [Analisis_5], Consolidado`;

export const queryReporteExpresiones = `SELECT Consolidado, Periodo, Tipo, Expresion, Valor, Operador, ExpresionC, ValorC, Resultado
    FROM Conta_ReporteExpresiones
    WHERE (Centro = @Centro) AND (ISNULL(Consolidado, 0) = @Consolidado) AND (Periodo = @Periodo)`;

export const queryReporteValores = `SELECT Centro, Periodo, Consolidado, Expresion, Valor, Operador, ValorRodas, Estado, IdDivision
    FROM Conta_ReporteValor 
    WHERE (Centro = @Centro) AND (ISNULL(Consolidado, 0) = @Consolidado) AND (Periodo = @Periodo) AND (IdDivision = @IdDivision)`;

export const queryInsertClasificadorRodas = `INSERT INTO contabilidad.cuentas(
  	anno, cuenta, subcuenta, nombre, naturaleza, tipo_analisis_1, tipo_analisis_2, tipo_analisis_3, tipo_analisis_4, tipo_analisis_5, obligacion, 
    grupo, clase, categoria, clasificacion, tipo, estado)
  VALUES  (@Anio, '@Cta', '@SubCta', '@Nombre', '@Nat', '@An1', '@An2', '@An3', '@An4', '@An5', @Obl, 
          '@Grupo', '@Clase', '@Categ', '@Clasif', '@Tipo', '@Estado')
  where not exists (SELECT cuenta FROM contabilidad.cuentas WHERE anno = @Anio AND cuenta = '@Cta' AND subcuenta = '@SubCta');`;

export const queryInsertCriterioConsolidacionRodas = `INSERT INTO contabilidad.cuentas_versus(
	modo, origen, cuenta, subcuenta, cuenta_consolidacion, subcuenta_consolidacion, tipo_analisis_1_consolidacion, analisis_1_consolidacion, tipo_analisis_2_consolidacion, analisis_2_consolidacion, tipo_analisis_3_consolidacion, analisis_3_consolidacion, tipo_analisis_4_consolidacion, analisis_4_consolidacion, tipo_analisis_5_consolidacion, analisis_5_consolidacion)
	VALUES ('I', 'C', '@Cta', '@SubCta', '@Cta', '@SubCta', '@TipoAn1Cons', '@An1Cons', '@TipoAn2Cons', '@An2Cons', '@TipoAn3Cons', '@An3Cons', '@TipoAn4Cons', '@An4Cons', '@TipoAn5Cons', '@An5Cons')
	where not exists (select cuenta from contabilidad.cuentas where modo = 'I' and origen = 'C' and cuenta = '@Cta' and subcuenta = '@SubCta');`;

export const queryUpdateClasificadorRodas = `UPDATE contabilidad.cuentas
  SET anno = @Anio, cuenta = '@Cta', subcuenta = '@SubCta', nombre = '@Nombre', naturaleza = '@Nat', tipo_analisis_1 = '@An1', tipo_analisis_2 = '@An2', tipo_analisis_3 = '@An3', tipo_analisis_4 = '@An4', tipo_analisis_5 = '@An5', 
    obligacion = '@Obl', grupo = '@Grupo', clase = '@Clase', categoria = '@Categ', clasificacion = '@Clasif', tipo = '@Tipo', estado = '@Estado'
  WHERE anno = @Anio AND cuenta = '@Cta' AND subcuenta = '@SubCta' ;`;

export const queryUpdateCriterioClasificadorRodas = `UPDATE contabilidad.cuentas_versus
  SET tipo_analisis_1_consolidacion = '@TipoAn1Cons', analisis_1_consolidacion = '@An1Cons', tipo_analisis_2_consolidacion = '@TipoAn2Cons', analisis_2_consolidacion = '@An2Cons', tipo_analisis_3_consolidacion = '@TipoAn3Cons', analisis_3_consolidacion = '@An3Cons', tipo_analisis_4_consolidacion = '@TipoAn4Cons', analisis_4_consolidacion = '@An4Cons', tipo_analisis_5_consolidacion = '@TipoAn5Cons', analisis_5_consolidacion = '@An5Cons'
  WHERE cuenta = '@Cta' AND subcuenta = '@SubCta';`;
