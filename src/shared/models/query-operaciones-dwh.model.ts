import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ConciliacionOperacionesDWH {
  @Field()
  Documento: string;

  @Field()
  Emisor: string;

  @Field({ nullable: true })
  FechaE?: string;

  @Field()
  ImporteE: number;

  @Field()
  Receptor: string;

  @Field({ nullable: true })
  FechaR?: string;

  @Field()
  ImporteR: number;

  @Field()
  Diferencia: number;
}

@ObjectType()
export class ConciliacionOperacionesDWHQueryResponse {
  @Field()
  success: boolean;

  @Field(() => [ConciliacionOperacionesDWH], { nullable: true })
  data?: ConciliacionOperacionesDWH[];

  @Field({ nullable: true })
  error?: string;
}

@InputType()
export class ConciliaOperacionesDWHInput {
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
}

export const queryConciliaOperacionesDWH = `SELECT ISNULL(Emisor.Documento, Receptor.Documento) AS Documento, ISNULL(Emisor.Emisor, Receptor.Emisor) AS Emisor, ISNULL(CONVERT(NVARCHAR(20), Emisor.Fecha, 103), '') AS FechaE, ROUND(SUM(ISNULL(Emisor.Importe, 0)) * -1, 2) AS ImporteE, 
  ISNULL(Receptor.Receptor, Emisor.Receptor) AS Receptor, ISNULL(CONVERT(NVARCHAR(20), Receptor.Fecha, 103), '') AS FechaR, ROUND(SUM(ISNULL(Receptor.Importe, 0)), 2) AS ImporteR, ROUND(SUM(ISNULL(Emisor.Importe, 0) * -1 - ISNULL(Receptor.Importe, 0)), 2) AS Diferencia
  FROM 
  (SELECT MAX(ESIR.Fecha) as Fecha, GAM.IdGerencia AS Emisor, ESIR.IdCuentaFinanciera AS Receptor, LTRIM(LEFT(ESIR.Documento, CASE CHARINDEX('!!', ESIR.Documento) WHEN 0 THEN CHARINDEX('!!', ESIR.Documento) ELSE CHARINDEX('!!', ESIR.Documento) - 1 END)) AS Documento, SUM(ISNULL(ESID.Cantidad, 0) * ISNULL(ESID.POperacion, 0)) AS Importe
  FROM EntradasSalidasInternasD AS ESID INNER JOIN EntradasSalidasInternasR AS ESIR ON ESID.idOperacion = ESIR.idOperacion INNER JOIN Gerencia_Ano_Mes AS GAM ON ESIR.IdGAM = GAM.IdGAM INNER JOIN 
    (SELECT IdUnidad, Nombre, 
    CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
    CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
  FROM (SELECT DISTINCT U.IdUnidad, RTRIM(U.IdUnidad) + '-' + MIN(U.Nombre) AS Nombre, MIN(U.IdSubdivision) AS IdSubdivision, RTRIM(MIN(U.IdSubdivision)) + '-' + S.Subdivision AS Subdivision, MIN(U.IdDivision) AS IdDivision, 
        RTRIM(MIN(U.IdDivision)) + '-' + D.Division AS Division
    FROM (SELECT IdUnidad, Nombre, IdSubdivision, IdDivision
        FROM           UnidadesComerciales.dbo.UnidadesComerciales
        UNION ALL
        SELECT        IdSubdivision, Subdivision, IdSubdivision, IdDivision
        FROM            UnidadesComerciales.dbo.Subdivisiones
        WHERE        (IdSubdivision NOT IN (SELECT IdUnidad FROM dbo.Unidades AS Unidades_1))
        UNION ALL
        SELECT        IdDivision, Division, IdDivision, IdDivision
        FROM            UnidadesComerciales.dbo.Divisiones) AS U INNER JOIN
        dbo.Subdivisiones AS S ON S.IdSubdivision = U.IdSubdivision INNER JOIN
        dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
    GROUP BY U.IdUnidad, S.Subdivision, D.Division) AS U) AS UCE ON UCE.IdUnidad = GAM.IdGerencia INNER JOIN 
  (SELECT IdUnidad, Nombre, 
  CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
  CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
  FROM (SELECT DISTINCT U.IdUnidad, RTRIM(U.IdUnidad) + '-' + MIN(U.Nombre) AS Nombre, MIN(U.IdSubdivision) AS IdSubdivision, RTRIM(MIN(U.IdSubdivision)) + '-' + S.Subdivision AS Subdivision, MIN(U.IdDivision) AS IdDivision, 
        RTRIM(MIN(U.IdDivision)) + '-' + D.Division AS Division
    FROM (SELECT IdUnidad, Nombre, IdSubdivision, IdDivision
        FROM           UnidadesComerciales.dbo.UnidadesComerciales
        UNION ALL
        SELECT        IdSubdivision, Subdivision, IdSubdivision, IdDivision
        FROM            UnidadesComerciales.dbo.Subdivisiones
        WHERE        (IdSubdivision NOT IN (SELECT IdUnidad FROM dbo.Unidades AS Unidades_1))
        UNION ALL
        SELECT        IdDivision, Division, IdDivision, IdDivision
        FROM            UnidadesComerciales.dbo.Divisiones) AS U INNER JOIN
        dbo.Subdivisiones AS S ON S.IdSubdivision = U.IdSubdivision INNER JOIN
        dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
    GROUP BY U.IdUnidad, S.Subdivision, D.Division) AS U) AS UCR ON UCR.IdUnidad = ESIR.IdCuentaFinanciera
  WHERE ESIR.Tipo IN('F', 'C') AND CONVERT(NVARCHAR(10), ESIR.Fecha, 112) >= '@FechaInicial' AND CONVERT(NVARCHAR(10), ESIR.Fecha, 112) <= '@FechaFinal'
  GROUP BY ESIR.IdCuentaFinanciera, LTRIM(LEFT(ESIR.Documento, CASE CHARINDEX('!!', ESIR.Documento) WHEN 0 THEN CHARINDEX('!!', ESIR.Documento) ELSE CHARINDEX('!!', ESIR.Documento) - 1 END)), GAM.Ano, GAM.IdGerencia, UCE.IdUnidad, UCE.IdDivision, UCE.IdSubdivision, UCR.IdUnidad, UCR.IdDivision, UCR.IdSubdivision 
  HAVING ((UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCE.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), GAM.IdGerencia) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCR.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), ESIR.IdCuentaFinanciera)) OR
    (UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCE.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), GAM.IdGerencia) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCR.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), ESIR.IdCuentaFinanciera)))) AS Emisor
  FULL OUTER JOIN
  (SELECT MAX(ESIR.Fecha) as Fecha, ESIR.IdCuentaFinanciera AS Emisor, GAM.IdGerencia AS Receptor, LTRIM(LEFT(ESIR.Documento, CASE CHARINDEX('!!', ESIR.Documento) WHEN 0 THEN CHARINDEX('!!', ESIR.Documento) ELSE CHARINDEX('!!', ESIR.Documento) - 1 END)) AS Documento, SUM(ISNULL(ESID.Cantidad, 0) * ISNULL(ESID.POperacion, 0)) AS Importe
  FROM EntradasSalidasInternasD AS ESID INNER JOIN EntradasSalidasInternasR AS ESIR ON ESID.idOperacion = ESIR.idOperacion INNER JOIN Gerencia_Ano_Mes AS GAM ON ESIR.IdGAM = GAM.IdGAM INNER JOIN 
      (SELECT IdUnidad, Nombre, 
      CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
      CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
  FROM (SELECT DISTINCT U.IdUnidad, RTRIM(U.IdUnidad) + '-' + MIN(U.Nombre) AS Nombre, MIN(U.IdSubdivision) AS IdSubdivision, RTRIM(MIN(U.IdSubdivision)) + '-' + S.Subdivision AS Subdivision, MIN(U.IdDivision) AS IdDivision, 
        RTRIM(MIN(U.IdDivision)) + '-' + D.Division AS Division
    FROM (SELECT IdUnidad, Nombre, IdSubdivision, IdDivision
        FROM           UnidadesComerciales.dbo.UnidadesComerciales
        UNION ALL
        SELECT        IdSubdivision, Subdivision, IdSubdivision, IdDivision
        FROM            UnidadesComerciales.dbo.Subdivisiones
        WHERE        (IdSubdivision NOT IN (SELECT IdUnidad FROM dbo.Unidades AS Unidades_1))
        UNION ALL
        SELECT        IdDivision, Division, IdDivision, IdDivision
        FROM            UnidadesComerciales.dbo.Divisiones) AS U INNER JOIN
        dbo.Subdivisiones AS S ON S.IdSubdivision = U.IdSubdivision INNER JOIN
        dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
    GROUP BY U.IdUnidad, S.Subdivision, D.Division) AS U) AS UCE ON UCE.IdUnidad = ESIR.IdCuentaFinanciera INNER JOIN 
  (SELECT IdUnidad, Nombre, 
      CASE WHEN IdUnidad IN (645, 652, 653, 992) THEN '641' WHEN IdUnidad IN (104, 600, 399) THEN '657' WHEN IdUnidad IN (127, 369) THEN '686' ELSE IdSubdivision END AS IdSubdivision,
      CASE WHEN IdUnidad IN (641, 645, 652, 653, 992, 657, 107, 104, 600, 399, 647, 620, 686, 369, 127, 833, 827, 357, 381, 380) THEN '380' ELSE IdDivision END AS IdDivision
  FROM (SELECT DISTINCT U.IdUnidad, RTRIM(U.IdUnidad) + '-' + MIN(U.Nombre) AS Nombre, MIN(U.IdSubdivision) AS IdSubdivision, RTRIM(MIN(U.IdSubdivision)) + '-' + S.Subdivision AS Subdivision, MIN(U.IdDivision) AS IdDivision, 
        RTRIM(MIN(U.IdDivision)) + '-' + D.Division AS Division
    FROM (SELECT IdUnidad, Nombre, IdSubdivision, IdDivision
        FROM           UnidadesComerciales.dbo.UnidadesComerciales
        UNION ALL
        SELECT        IdSubdivision, Subdivision, IdSubdivision, IdDivision
        FROM            UnidadesComerciales.dbo.Subdivisiones
        WHERE        (IdSubdivision NOT IN (SELECT IdUnidad FROM dbo.Unidades AS Unidades_1))
        UNION ALL
        SELECT        IdDivision, Division, IdDivision, IdDivision
        FROM            UnidadesComerciales.dbo.Divisiones) AS U INNER JOIN
        dbo.Subdivisiones AS S ON S.IdSubdivision = U.IdSubdivision INNER JOIN
        dbo.Divisiones AS D ON D.IdDivision = U.IdDivision
    GROUP BY U.IdUnidad, S.Subdivision, D.Division) AS U) AS UCR ON UCR.IdUnidad = GAM.IdGerencia 
  WHERE ESIR.Tipo IN('R', 'P') AND CONVERT(NVARCHAR(10), ESIR.Fecha, 112) >= '@FechaInicial' AND CONVERT(NVARCHAR(10), ESIR.Fecha, 112) <= '@FechaFinal'
  GROUP BY ESIR.IdCuentaFinanciera, LTRIM(LEFT(ESIR.Documento, CASE CHARINDEX('!!', ESIR.Documento) WHEN 0 THEN CHARINDEX('!!', ESIR.Documento) ELSE CHARINDEX('!!', ESIR.Documento) - 1 END)), GAM.Ano, GAM.IdGerencia, UCE.IdUnidad, UCE.IdDivision, UCE.IdSubdivision, UCR.IdUnidad, UCR.IdDivision, UCR.IdSubdivision
  HAVING ((UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCE.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), ESIR.IdCuentaFinanciera) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCR.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), GAM.IdGerencia)) OR
    (UCE.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionO as INT), 0), UCE.IdDivision) AND UCE.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionO as INT), 0), UCE.IdSubDivision) AND ESIR.IdCuentaFinanciera = ISNULL(NULLIF(CAST(@IdUnidadO as INT), 0), ESIR.IdCuentaFinanciera) AND UCR.IdDivision = ISNULL(NULLIF(CAST(@IdDivisionA as INT), 0), UCR.IdDivision) AND UCR.IdSubDivision = ISNULL(NULLIF(CAST(@IdSubdivisionA as INT), 0), UCR.IdSubDivision) AND GAM.IdGerencia = ISNULL(NULLIF(CAST(@IdUnidadA as INT), 0), GAM.IdGerencia))) ) AS Receptor
  ON Receptor.Emisor = Emisor.Emisor AND Receptor.Receptor = Emisor.Receptor AND Receptor.Documento = Emisor.Documento
  GROUP BY ISNULL(Emisor.Documento, Receptor.Documento), ISNULL(Emisor.Emisor, Receptor.Emisor), ISNULL(Receptor.Receptor, Emisor.Receptor), ISNULL(CONVERT(NVARCHAR(20), Emisor.Fecha, 103), ''), ISNULL(CONVERT(NVARCHAR(20), Receptor.Fecha, 103), '')`;
