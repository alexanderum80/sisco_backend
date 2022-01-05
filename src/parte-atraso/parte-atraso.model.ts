
export const queryParteAtrasos = `SELECT     UC.IdUnidad, MIN(UC.Nombre) AS Nombre, MIN(UC.IdDivision) AS IdDivision, MIN(Divisiones.Division) AS Division,
    CASE WHEN MAX(Fecha) IS NOT NULL THEN LTrim(Str(DateDiff(day, MAX(Fecha), GetDate()))) ELSE 'infinito' END AS Atraso
    FROM         (SELECT     G.IdGAM, G.IdGerencia, g.Ano, g.Mes, g.Fecha, g.Version, G.UltimaCircular
                    FROM    dbo.Gerencia_Ano_Mes AS G INNER JOIN
                            (SELECT     IdGerencia, MAX(Ano * 100 + Mes) AS anomes
                            FROM          dbo.Gerencia_Ano_Mes
                            GROUP BY IdGerencia) AS MF ON G.IdGerencia = MF.IdGerencia AND G.Ano * 100 + G.Mes = MF.anomes
                            ) GAM RIGHT OUTER JOIN
    UnidadesComerciales.dbo.UnidadesComerciales UC INNER JOIN
    UnidadesComerciales.dbo.Divisiones Divisiones ON UC.IdDivision = Divisiones.IdDivision LEFT OUTER JOIN
    UnidadesComerciales.dbo.Subdivisiones Subdivisiones ON UC.IdSubdivision = Subdivisiones.IdSubdivision ON
    GAM.IdGerencia = UC.IdUnidad LEFT OUTER JOIN
    UnidadesComerciales.dbo.Telefono TELEF ON TELEF.IdUnidad = UC.IdUnidad
    WHERE UC.Abierta = 1
    GROUP BY UC.IdUnidad
    HAVING (DATEDIFF(day, ISNULL(MAX(GAM.Fecha),0), GETDATE()) >= 2)`;

export const queryDatosIdGAM = `SELECT IdGerencia AS IdUnidad, RTRIM(UC.IdUnidad) + '-' + UC.Nombre AS Unidad, Ano, Mes, Fecha, Version, UltimaCircular, PeriodoRestaurado, vUtilnet FROM dbo.Gerencia_Ano_Mes AS GAM INNER JOIN UnidadesComerciales.dbo.UnidadesComerciales AS UC ON UC.IdUnidad = GAM.IdGerencia WHERE Ano = @Annio`;
