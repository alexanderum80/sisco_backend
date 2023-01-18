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

export const queryUltimoPeriodo = `SELECT ISNULL(MAX(Período), -1) as Periodo FROM dbo.Conta_Asiento
    WHERE Centro = @Centro and isnull(Consolidado, 0) = @Cons and Año = @Anio`;

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

export const queryComprobantesRodas = `SELECT anno, tipo, numero, periodo, estado, descripcion, fecha_hora, usuario, fecha_hora_actualizacion, usuario_actualizacion, fecha_hora_traspaso, usuario_traspaso, modo, origen, entidad, tipo_, numero_, archivo, debito, credito
    FROM contabilidad.comprobantes
    where anno = @anno and periodo = @periodo;`;

export const queryAsientoRodas = `SELECT a.anno_comprobante, a.tipo_comprobante, a.numero_comprobante, a.tipo_documento, a.documento, a.id, a.cuenta, a.subcuenta, a.tipo_analisis_1, a.analisis_1, a.tipo_analisis_2, a.analisis_2, a.tipo_analisis_3, a.analisis_3, a.tipo_analisis_4, a.analisis_4, a.tipo_analisis_5, a.analisis_5, a.naturaleza, a.debito, a.credito, a.tipo_moneda, a.tasa_cambio, a.debito_moneda, a.credito_moneda, a.tipo_documento_obligacion, a.documento_obligacion, a.fecha_documento_obligacion, a.detalle, a.fecha_compromiso_documento_obligacion, a.codigo_almacen
    FROM contabilidad.asientos as a inner join contabilidad.comprobantes as c on a.anno_comprobante = c.anno and 
        a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero
    where a.anno_comprobante = @anno and c.periodo = @periodo;`;

export const querySaldosAcumuladosRodas = `SELECT ROUND(SUM(ROUND(a.debito, 2)), 2) AS debito, ROUND(SUM(ROUND(a.credito, 2)), 2) AS credito
    FROM contabilidad.asientos as a inner join contabilidad.comprobantes as c on a.anno_comprobante = c.anno and 
        a.tipo_comprobante = c.tipo and a.numero_comprobante = c.numero
        where a.anno_comprobante = @anno and c.periodo = @periodo;`;

export const queryReporteConsultas = `SELECT Periodo, Centro, IdConsulta, Consulta, Cuenta, SubCuenta, [Análisis 1] as Analisis1, [Análisis 2] as Analisis2, [Análisis 3] as Analisis3, SUM(Total) AS Total, Consolidado
    FROM Conta_ReporteConsultas
    WHERE (Consolidado = @Consolidado) AND (Centro = @Centro) AND (Periodo = @Periodo) AND (IdConsulta = @IdConsulta)
    GROUP BY Periodo, Centro, IdConsulta, Consulta, Cuenta, SubCuenta, [Análisis 1], [Análisis 2], [Análisis 3], Consolidado`;

export const queryReporteExpresiones = `SELECT Consolidado, Periodo, Tipo, Expresion, Valor, Operador, ExpresionC, ValorC, Resultado
    FROM Conta_ReporteExpersiones
    WHERE (Centro = @Centro) AND (ISNULL(Consolidado, 0) = @Consolidado) AND (Periodo = @Periodo)`;

export const queryReporteValores = `SELECT Centro, Periodo, Consolidado, Expresion, Valor, Operador, ValorRodas, Estado, IdDivision
    FROM Conta_ReporteValor WHERE (Centro = @Centro) AND (ISNULL(Consolidado, 0) = @Consolidado) AND (Periodo = @Periodo) AND (IdDivision = @IdDivision)`;

export const queryCentrosByConsolidado = `SELECT T.Centro FROM (
	SELECT CASE WHEN [Tipo de Análisis 1] = 'X' THEN [Análisis 1]
				WHEN [Tipo de Análisis 2] = 'X' THEN [Análisis 2]
				WHEN [Tipo de Análisis 3] = 'X' THEN [Análisis 3]
				ELSE '' END AS Centro, Cuenta, ABS(SUM(Débito - Crédito)) AS Saldo
	FROM dbo.Asiento
	GROUP BY CASE WHEN [Tipo de Análisis 1] = 'X' THEN [Análisis 1]
				WHEN [Tipo de Análisis 2] = 'X' THEN [Análisis 2]
				WHEN [Tipo de Análisis 3] = 'X' THEN [Análisis 3]
				ELSE '' END, Cuenta
	HAVING SUM(Débito - Crédito) NOT BETWEEN -0.0001 AND 0.0001) AS T
    GROUP BY T.Centro
    ORDER BY T.Centro`;

export const queryInsertClasificadorUnidad = `IF NOT EXISTS (SELECT * FROM dbo.[Clasificador de Cuentas] WHERE Año = @Anio AND Cuenta = '@Cta' AND SubCuenta = '@SubCta')
    INSERT dbo.[Clasificador de Cuentas]
            (Año, Cuenta, SubCuenta, Descripción, Naturaleza, SubMayor, 
            [Tipo de Análisis 1], [Tipo de Análisis 2], [Tipo de Análisis 3], Obligación, Terminal, 
            [Cuenta Consolidación], [SubCuenta Consolidación], [Tipo de Análisis 1 Consolidación], [Tipo de Análisis 2 Consolidación], [Tipo de Análisis 3 Consolidación], [Condición Consolidación], 
            [Análisis 1 Consolidación], [Análisis 2 Consolidación], [Análisis 3 Consolidación], 
            [Moneda Extranjera], Estado, aporta_presupuesto, gasto_presupuesto, ingreso_presupuesto, Resultados_presupuesto, Capital_presupuesto, MEMO)
    VALUES  (@Anio, '@Cta', '@SubCta', '@Desc', '@Nat', @Subm,
            '@An1', '@An2', '@An3', @Obl, @Term, 
            '@Cta', '@SubCta', '@ConsTipoAn1', '@ConsTipoAn2', '@ConsTipoAn3', '@CondCons', '@ConsAn1', '@ConsAn2', '@ConsAn3', 
            0, 'A', 0, 0, 0, 0, 0, 0)`;

export const queryUpdateClasificadorUnidad = `UPDATE dbo.[Clasificador de Cuentas]
    SET Descripción = '@Desc', Naturaleza = '@Nat', SubMayor = @Subm, 
                [Tipo de Análisis 1] = '@An1', [Tipo de Análisis 2] = '@An2', [Tipo de Análisis 3] = '@An3', Obligación = @Obl, Terminal = @Term, 
                [Cuenta Consolidación] = '@Cta', [SubCuenta Consolidación] = '@SubCta', [Tipo de Análisis 1 Consolidación] = '@ConsTipoAn1', [Tipo de Análisis 2 Consolidación] = '@ConsTipoAn2', [Tipo de Análisis 3 Consolidación] = '@ConsTipoAn3', 
                [Condición Consolidación] = '@CondCons', [Análisis 1 Consolidación] = '@ConsAn1', [Análisis 2 Consolidación] = '@ConsAn2', [Análisis 3 Consolidación] = '@ConsAn2'
    WHERE Año = @Anio AND Cuenta = '@Cta' AND SubCuenta = '@SubCta'`;

export const querySwitchAuditRodas = `USE master 
    IF (CAST(PARSENAME(CAST(SERVERPROPERTY('ProductVersion') AS SYSNAME), CASE WHEN SERVERPROPERTY('ProductVersion') IS NULL THEN 3 ELSE 4 END) AS INT) > 9) 
    BEGIN 
        DECLARE @query NVARCHAR(255) 
        SET @query = 'IF EXISTS(SELECT * FROM sys.server_audits WHERE name = ''@DataBase_ServerAudit'') 
        ALTER SERVER AUDIT [@DataBase_ServerAudit] WITH (STATE=@Accion)' 
        EXEC(@query) 
    END`;
