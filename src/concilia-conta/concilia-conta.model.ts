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

export const queryRangoAsientosMesRodas = `SELECT Período, MIN(Asiento) AS Ini, MAX(Asiento) AS Fin FROM dbo.Asiento GROUP BY Período ORDER BY Período`;

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

export const queryInsertClasificadorUnidad = `IF NOT EXISTS (SELECT * FROM dbo.[Clasificador de Cuentas] WHERE Año = @Anio AND Cuenta = '@Cta' AND SubCuenta = '@Subcta')
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
