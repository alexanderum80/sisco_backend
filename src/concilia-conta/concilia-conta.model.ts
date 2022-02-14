import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConciliaContaQueryResponse {
    @Field()
    success: Boolean;

    @Field({ nullable: true })
    data?: string;

    @Field(type => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ConciliaContabilidad {
    @Field(type => ConciliaContaQueryResponse)
    ReporteClasificador: ConciliaContaQueryResponse;

    @Field(type => ConciliaContaQueryResponse)
    ReporteConsultas: ConciliaContaQueryResponse;

    @Field(type => ConciliaContaQueryResponse)
    ReporteExpresiones: ConciliaContaQueryResponse;

    @Field(type => ConciliaContaQueryResponse)
    ReporteValores: ConciliaContaQueryResponse;
}

@ObjectType()
export class ConciliaContabilidadQueryResponse {
    @Field()
    success: Boolean;

    @Field(type => ConciliaContabilidad, { nullable: true })
    data?: ConciliaContabilidad;

    @Field(type => String, { nullable: true })
    error?: String;
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

export const queryInventarioRodasCons = `SELECT @Centro AS IdCentro, CASE WHEN [Tipo de Análisis 1] = 'X' THEN [Análisis 1] ELSE Centro END AS IdUnidad, '000' AS IdPiso, @Periodo AS Periodo, Cuenta, SubCuenta, SUM(Débito) - SUM(Crédito) AS Saldo, N'' as Crt1, N'' as Crt2, N'' as Crt3
    FROM dbo.Conta_Asiento
    WHERE (Centro = @Centro) AND (Consolidado = 1) AND (Año = @Anio) AND (Período <= @Periodo) AND ((RTRIM(Cuenta) BETWEEN 183 AND 209) OR (RTRIM(Cuenta) IN(280, 281))) and ((CASE[Tipo de Análisis 1] WHEN '4' THEN ISNULL([Análisis 1], N'0') ELSE (CASE[Tipo de Análisis 2] WHEN '4' THEN ISNULL([Análisis 2], N'0') ELSE (CASE [Tipo de Análisis 3] WHEN '4' THEN ISNULL([Análisis 3], N'0') ELSE N'001' end) END) END <> '002'))
    GROUP BY Cuenta, SubCuenta, CASE WHEN [Tipo de Análisis 1] = 'X' THEN [Análisis 1] ELSE Centro END`;

export const queryInventarioRodas = `SELECT @Centro AS IdCentro, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] ELSE Centro END AS IdUnidad, CASE [Tipo de Análisis 1] WHEN 'G' then ISNULL([Análisis 1], N'0') ELSE (CASE [Tipo de Análisis 1] WHEN 'A' then
    ISNULL([Análisis 1], N'0') ELSE (CASE [Tipo de Análisis 2] WHEN 'G' then ISNULL([Análisis 2], N'0') ELSE (CASE [Tipo de Análisis 2] WHEN 'A' then ISNULL([Análisis 2], N'0') ELSE (CASE [Tipo de Análisis 3] WHEN 'G' then ISNULL([Análisis 3], N'0') ELSE (CASE [Tipo de Análisis 3] WHEN 'A' then ISNULL([Análisis 3], N'0') ELSE ('0') END) END) END) END) END) END AS IdPiso,
    @Periodo AS Periodo, Cuenta, SubCuenta, ISNULL([Análisis 1], N'') as Crt1, ISNULL([Análisis 2], N'') as Crt2, ISNULL([Análisis 3], N'') as Crt3, SUM(Débito) - SUM(Crédito) AS Saldo
    FROM dbo.Conta_Asiento
    WHERE (Centro = @Centro) AND (Consolidado = 0) AND (Año = @Anio) AND (Período <= @Periodo) AND ((RTRIM(Cuenta) BETWEEN 183 AND 209) OR (RTRIM(Cuenta) IN (280,281))) and ((CASE[Tipo de Análisis 1] WHEN '4' THEN ISNULL([Análisis 1], N'0') ELSE(CASE[Tipo de Análisis 2] WHEN '4' THEN ISNULL([Análisis 2], N'0') ELSE(CASE[Tipo de Análisis 3] WHEN '4' THEN ISNULL([Análisis 3], N'0') ELSE N'001' end) END) END <> '002'))
    GROUP BY Cuenta, SubCuenta, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] ELSE Centro END, ISNULL([Análisis 1], N''), ISNULL([Análisis 2], N''), ISNULL([Análisis 3], N''), ISNULL([Análisis 1], N'0'), ISNULL([Análisis 2], N'0'), ISNULL([Análisis 3], N'0'), [Tipo de Análisis 1], [Tipo de Análisis 2], [Tipo de Análisis 3]`;

export const queryVentasRodasCons = `SELECT @Centro AS IdCentro, CASE WHEN [Tipo de Análisis 2] = 'X' THEN [Análisis 2] ELSE Centro END AS IdUnidad, '000' AS IdPiso, @Periodo AS Periodo, '' AS Cuenta, '' AS SubCuenta, N'' as Crt1, N'' as Crt2, N'' as Crt3, SUM(Crédito) - SUM(Débito) AS Saldo
    FROM dbo.Conta_Asiento
    WHERE(Centro = @Centro) AND (Consolidado = 1) AND(Año = @Anio) AND(Período = @Periodo) AND(RTRIM(Cuenta) IN (900, 901, 912))
    GROUP BY CASE WHEN [Tipo de Análisis 2] = 'X' THEN [Análisis 2] ELSE Centro END`;

export const queryVentasRodas = `SELECT @Centro AS IdCentro, CASE WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] ELSE Centro END AS IdUnidad,
    CASE [Tipo de Análisis 1] WHEN 'G' then ISNULL([Análisis 1], N'0') ELSE (CASE [Tipo de Análisis 1] WHEN 'A' then ISNULL([Análisis 1], N'0') ELSE (CASE [Tipo de Análisis 2] WHEN 'G' then ISNULL([Análisis 2], N'0') ELSE (CASE [Tipo de Análisis 2] WHEN 'A' then ISNULL([Análisis 2], N'0') ELSE (CASE [Tipo de Análisis 3] WHEN 'G' then ISNULL([Análisis 3], N'0') ELSE (CASE [Tipo de Análisis 3] WHEN 'A' then ISNULL([Análisis 3], N'0') ELSE ('0') END) END) END) END) END) END AS IdPiso,
    @Periodo AS Periodo, Cuenta, SubCuenta, ISNULL([Análisis 1], N'') as Crt1, ISNULL([Análisis 2], N'') as Crt2, ISNULL([Análisis 3], N'') as Crt3, SUM(Crédito -débito) AS Saldo
    FROM dbo.Conta_Asiento
    WHERE (Centro = @Centro) AND (Consolidado = 0) AND (Año = @Anio) AND (Período = @Periodo) AND (RTRIM(Cuenta) IN (900, 901, 912))
    GROUP BY Cuenta, SubCuenta, CASE WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] ELSE Centro END, ISNULL([Análisis 1], N''), ISNULL([Análisis 2], N''), ISNULL([Análisis 3], N''), ISNULL([Análisis 1], N'0'), ISNULL([Análisis 2], N'0'), ISNULL([Análisis 3], N'0'), [Tipo de Análisis 1], [Tipo de Análisis 2], [Tipo de Análisis 3]`;

export const queryUltimoPeriodo = `SELECT ISNULL(MAX(Período), -1) as Periodo FROM dbo.Conta_Asiento
    WHERE Centro = @Centro and isnull(Consolidado, 0) = @Cons and Año = @Anio`;

export const queryRangoAsientosMes = `SELECT Período, MIN(Asiento) AS Ini, MAX(Asiento) AS Fin FROM dbo.Asiento GROUP BY Período ORDER BY Período`;

export const queryClasificadorCuentasRodas = `SELECT Año, Cuenta, SubCuenta, Descripción, Naturaleza, [Grupo Clase] AS Grupo_Clase, SubMayor, [Tipo de Análisis 1] AS Tipo_de_Análisis_1, [Tipo de Análisis 2] AS Tipo_de_Análisis_2, [Tipo de Análisis 3] AS Tipo_de_Análisis_3, Obligación, Terminal, Real, [Cuenta Contrapartida] AS Cuenta_Contrapartida,
    [SubCuenta Contrapartida] AS SubCuenta_Contrapartida, [Cuenta Consolidación] AS Cuenta_Consolidación, [SubCuenta Consolidación] AS SubCuenta_Consolidación, [Tipo de Análisis 1 Consolidación] AS Tipo_de_Análisis_1_Consolidación, [Tipo de Análisis 2 Consolidación] AS Tipo_de_Análisis_2_Consolidación, [Tipo de Análisis 3 Consolidación] AS Tipo_de_Análisis_3_Consolidación,
    [Obligación Consolidación] AS Obligación_Consolidación, [Condición Consolidación] AS Condición_Consolidación, [Cuenta Ganancia] AS Cuenta_Ganancia, [SubCuenta Ganancia] AS SubCuenta_Ganancia, [Cuenta Pérdida] AS Cuenta_Pérdida, [SubCuenta Pérdida] AS SubCuenta_Pérdida, [Moneda Extranjera] AS Moneda_Extranjera, Estado, [Cuenta Conversión] AS Cuenta_Conversión,
    [SubCuenta Conversión] AS SubCuenta_Conversión, [Tipo de Análisis 1 Conversión] AS Tipo_de_Análisis_1_Conversión, [Tipo de Análisis 2 Conversión] AS  Tipo_de_Análisis_2_Conversión, [Tipo de Análisis 3 Conversión]  AS Tipo_de_Análisis_3_Conversión, [Obligación Conversión] AS Obligación_Conversión, [Descripción Conversión] AS Descripción_Conversión, [Naturaleza Conversión] AS Naturaleza_Conversión,
    [Terminal Conversión] AS Terminal_Conversión, [Moneda Extranjera Conversión] AS Moneda_Extranjera_Conversión, [Análisis 1 Consolidación] AS Análisis_1_Consolidación, [Análisis 2 Consolidación] AS Análisis_2_Consolidación, [Análisis 3 Consolidación] AS Análisis_3_Consolidación, aporta_presupuesto, gasto_presupuesto, ingreso_presupuesto,
    Resultados_presupuesto, Capital_presupuesto, MEMO
    FROM [Clasificador de Cuentas] as [Clasificador_de_Cuentas]`;

export const queryComprobantesRodas = `SELECT Tipo, Número, Período, RTRIM(YEAR(Fecha)) + '/' + RIGHT('00' + RTRIM(MONTH(Fecha)), 2) + '/' + RIGHT('00' + RTRIM(DAY(Fecha)), 2) AS Fecha, Descripción,
    Estado, Usuario, RTRIM(YEAR([Ultima Actualización])) + '/' + RIGHT('00' + RTRIM(MONTH([Ultima Actualización])), 2) + '/' + RIGHT('00' + RTRIM(DAY([Ultima Actualización])), 2) AS Ultima_Actualización,
    [Traspasado por] AS Traspasado_por, RTRIM(YEAR([Fecha Traspaso])) + '/' + RIGHT('00' + RTRIM(MONTH([Fecha Traspaso])), 2) + '/' + RIGHT('00' + RTRIM(DAY([Fecha Traspaso])), 2) AS Fecha_Traspaso,
    Débito, Crédito, IsNull([Usuario Red], '') AS Usuario_Red, IsNull(subsistema, '') as subsistema, IsNull(siglas, '') as siglas
    FROM Comprobantes WHERE Período = @Periodo`;

export const queryAsientoRodas = `SELECT [Tipo de Comprobante] AS Tipo_de_Comprobante, [Número de Comprobante] AS Número_de_Comprobante, [Número de Documento] AS Número_de_Documento, [Período], [Asiento],
    [Tipo de Asiento] AS Tipo_de_Asiento, [Cuenta], [SubCuenta],[Tipo de Análisis 1] AS Tipo_de_Análisis_1, [Análisis 1] AS Análisis_1, [Tipo de Análisis 2] AS Tipo_de_Análisis_2, [Análisis 2] AS Análisis_2, [Tipo de Análisis 3] AS Tipo_de_Análisis_3, [Análisis 3] AS Análisis_3,
    [Detalle], [Naturaleza], [Débito], [Crédito], [Moneda Extranjera] AS Moneda_Extranjera, [Tipo de Moneda] AS Tipo_de_Moneda, [Tasa], [Estado], [Documento de Obligación] AS Documento_de_Obligación,
	ISNULL(RTRIM(YEAR([Fecha])) + '/' + RIGHT('00' + RTRIM(MONTH(Fecha)), 2) + '/' + RIGHT('00' + RTRIM(DAY(Fecha)), 2), '') AS Fecha, [Saldo]
    FROM Asiento WHERE Período = @Periodo ORDER BY Asiento`;

export const queryMayorRodas = `SELECT Cuenta, SubCuenta, Período, Débito, Crédito, [Débito Acumulado] as Débito_Acumulado, [Crédito Acumulado] as Crédito_Acumulado
    FROM Mayor where Período = @Periodo ORDER BY Período, Cuenta, SubCuenta`;

export const querySaldosAcumuladosRodas = `SELECT ISNULL(ROUND(SUM(Débito), 2), 0) AS Debito, ISNULL(ROUND(SUM(Crédito), 2), 0) AS Credito
    FROM dbo.Asiento WHERE Período < @Periodo`;

export const queryReporteConsultas = `SELECT Periodo, Centro, IdConsulta, Consulta, Cuenta, SubCuenta, [Análisis 1] as Analisis1, [Análisis 2] as Analisis2, [Análisis 3] as Analisis3, SUM(Total) AS Total, Consolidado
    FROM Conta_ReporteConsultas
    WHERE (Consolidado = @Consolidado) AND (Centro = @Centro) AND (Periodo = @Periodo) AND (IdConsulta = @IdConsulta)
    GROUP BY Periodo, Centro, IdConsulta, Consulta, Cuenta, SubCuenta, [Análisis 1], [Análisis 2], [Análisis 3], Consolidado`;

export const queryReporteExpresiones = `SELECT Consolidado, Periodo, Tipo, Expresion, Valor, Operador, ExpresionC, ValorC, Resultado
    FROM Conta_ReporteExpersiones
    WHERE (Centro = @Centro) AND (ISNULL(Consolidado, 0) = @Consolidado) AND (Periodo = @Periodo)`;

export const queryReporteValores = `SELECT Centro, Periodo, Consolidado, Codigo, Expresion, Valor, Operador, ValorRodas, Estado
    FROM Conta_ReporteValor WHERE (Centro = @Centro) AND (ISNULL(Consolidado, 0) = @Consolidado) AND (Periodo = @Periodo)`;


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