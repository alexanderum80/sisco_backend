import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ConciliacionInterna {
    @Field()
    Documento: string;

    @Field()
    Emisor: string;

    @Field()
    FechaE: Date;

    @Field()
    ImporteE: number;

    @Field()
    Receptor: string;

    @Field()
    FechaR: Date;

    @Field()
    ImporteR: number;

    @Field()
    Diferencia: number;
}

@ObjectType()
export class ConciliacionInternaDWHQueryResponse {
    @Field()
    success: boolean;

    @Field(() => [ConciliacionInterna], { nullable: true })
    data?: ConciliacionInterna[];

    @Field({ nullable: true })
    error?: string;
}

@InputType()
export class ConciliaInternaDWHInput {
    @Field()
    FechaInicial: string;

    @Field()
    FechaFinal: string;

    @Field()
    IdDivision: number;

    @Field()
    IdSubdivision: number;

    @Field()
    IdUnidad: number;

    @Field()
    IdDivisionOD: number;

    @Field()
    IdSubdivisionOD: number;

    @Field()
    IdUnidadOD: number;

    @Field()
    SoloDiferencias: boolean;
}

export const queryConciliaInternaDWH = `SELECT Emisor, MAX(T.FechaE) AS FechaE, Receptor, MAX(T.FechaR) AS FechaR, Documento, ROUND(SUM(ISNULL(ImporteE, 0)) * -1, 2) AS ImporteE, ROUND(SUM(ISNULL(ImporteR, 0)), 2) AS ImporteR, ROUND(SUM(ISNULL(ImporteE, 0) * -1 - ISNULL(ImporteR, 0)), 2) AS Diferencia
FROM (SELECT ESIR.Fecha AS FechaE, '' AS FechaR, GAM.IdGerencia AS Emisor, ESIR.IdCuentaFinanciera AS Receptor, LTRIM(LEFT(ESIR.Documento, CASE CHARINDEX('!!', ESIR.Documento) WHEN 0 THEN CHARINDEX('!!', ESIR.Documento) ELSE CHARINDEX('!!', ESIR.Documento) - 1 END)) AS Documento, SUM(ISNULL(ESID.Cantidad, 0) * ISNULL(ESID.POperacion, 0)) AS ImporteE, 0 AS ImporteR
FROM EntradasSalidasInternasD AS ESID INNER JOIN EntradasSalidasInternasR AS ESIR ON ESID.idOperacion = ESIR.idOperacion INNER JOIN Gerencia_Ano_Mes AS GAM ON ESIR.IdGAM = GAM.IdGAM INNER JOIN 
    (SELECT IdUnidad, Nombre, Abierta, Distribuidora,
    CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
    CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
FROM UnidadesComerciales.dbo.UnidadesComerciales) AS UCE ON UCE.IdUnidad = GAM.IdGerencia INNER JOIN 
    (SELECT IdUnidad, Nombre, Abierta, Distribuidora,
    CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
    CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
FROM UnidadesComerciales.dbo.UnidadesComerciales) AS UCR ON UCR.IdUnidad = ESIR.IdCuentaFinanciera
GROUP BY ESIR.Fecha, ESIR.IdCuentaFinanciera, ESIR.Tipo, ISNULL(ESIR.Fecha, 0), ESIR.Documento, ISNULL(GAM.IdGerencia, 0), ISNULL(GAM.Ano, 0), GAM.IdGerencia, UCE.IdUnidad, UCE.Distribuidora, UCE.IdDivision, UCE.IdSubdivision, UCR.IdUnidad, UCR.Distribuidora, UCR.IdDivision, UCR.IdSubdivision @FiltroInternaEmisor AND ESIR.Tipo IN('F', 'C')
UNION ALL
SELECT '', ESIR.Fecha, ESIR.IdCuentaFinanciera AS Emisor, GAM.IdGerencia AS Receptor, LTRIM(LEFT(ESIR.Documento, CASE CHARINDEX('!!', ESIR.Documento) WHEN 0 THEN CHARINDEX('!!', ESIR.Documento) ELSE CHARINDEX('!!', ESIR.Documento) - 1 END)) AS Documento, 0 AS ImporteE, SUM(ISNULL(ESID.Cantidad, 0) * ISNULL(ESID.POperacion, 0)) AS ImporteR
FROM EntradasSalidasInternasD AS ESID INNER JOIN EntradasSalidasInternasR AS ESIR ON ESID.idOperacion = ESIR.idOperacion INNER JOIN Gerencia_Ano_Mes AS GAM ON ESIR.IdGAM = GAM.IdGAM INNER JOIN 
    (SELECT IdUnidad, Nombre, Abierta, Distribuidora,
    CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
    CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
FROM UnidadesComerciales.dbo.UnidadesComerciales) AS UCE ON UCE.IdUnidad = ESIR.IdCuentaFinanciera INNER JOIN 
(SELECT IdUnidad, Nombre, Abierta, Distribuidora,
    CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
    CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
FROM UnidadesComerciales.dbo.UnidadesComerciales) AS UCR ON UCR.IdUnidad = GAM.IdGerencia 
GROUP BY ESIR.Fecha, ESIR.IdCuentaFinanciera, ESIR.Tipo, ISNULL(ESIR.Fecha, 0), ESIR.Documento, ISNULL(GAM.IdGerencia, 0), ISNULL(GAM.Ano, 0), GAM.IdGerencia, UCE.IdUnidad, UCE.Distribuidora, UCE.IdDivision, UCE.IdSubdivision, UCR.IdUnidad, UCR.Distribuidora, UCR.IdDivision, UCR.IdSubdivision @FiltroInternaReceptor AND ESIR.Tipo IN('R', 'P')) AS T
GROUP BY Emisor, Receptor, Documento @FiltroSoloDiferencias`;

export const filtroInternaEmisor = `
    HAVING RTRIM(YEAR(ESIR.Fecha)) + RTRIM(FORMAT(MONTH(ESIR.Fecha), '00')) + RTRIM(FORMAT(day(ESIR.Fecha), '00')) >= '@FechaInicial' AND RTRIM(YEAR(ESIR.Fecha)) + RTRIM(FORMAT(MONTH(ESIR.Fecha), '00')) + RTRIM(FORMAT(day(ESIR.Fecha), '00')) <= '@FechaFinal' AND ((UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCE.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), GAM.IdGerencia) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCR.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), ESIR.IdCuentaFinanciera)) OR
    (UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCE.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), GAM.IdGerencia) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCR.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), ESIR.IdCuentaFinanciera)))`;

export const filtroInternaReceptor = `
    HAVING RTRIM(YEAR(ESIR.Fecha)) + RTRIM(FORMAT(MONTH(ESIR.Fecha), '00')) + RTRIM(FORMAT(day(ESIR.Fecha), '00')) >= '@FechaInicial' AND RTRIM(YEAR(ESIR.Fecha)) + RTRIM(FORMAT(MONTH(ESIR.Fecha), '00')) + RTRIM(FORMAT(day(ESIR.Fecha), '00')) <= '@FechaFinal' AND ((UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCE.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), ESIR.IdCuentaFinanciera) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCR.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), GAM.IdGerencia)) OR
    (UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCE.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), ESIR.IdCuentaFinanciera) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCR.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), GAM.IdGerencia)))`;

export const soloDiferencias = ` HAVING ROUND(SUM(ISNULL(ImporteE, 0) *-1 - ISNULL(ImporteR, 0)), 2) <> 0`;