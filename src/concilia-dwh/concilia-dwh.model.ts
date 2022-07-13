import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class RodasDWHQueryResponse {
    @Field()
    success: Boolean;

    @Field({ nullable: true })
    data?: string;

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ConciliaDWH {
    @Field(() => RodasDWHQueryResponse)
    RodasDWHInventarioVentas: RodasDWHQueryResponse;

    @Field(() => RodasDWHQueryResponse)
    RodasDWHAlmacenes: RodasDWHQueryResponse;

    @Field(() => RodasDWHQueryResponse)
    RodasDWHNota: RodasDWHQueryResponse;
}

@ObjectType()
export class ConciliaDWHQueryResponse {
    @Field()
    success: Boolean;

    @Field(() => ConciliaDWH, { nullable: true })
    data?: ConciliaDWH;

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class ParteAtrasosQueryResponse {
    @Field()
    success: Boolean;

    @Field({ nullable: true })
    data?: string;

    @Field(() => String, { nullable: true })
    error?: String;
}

@ObjectType()
export class DatosIdGAMQueryResponse {
    @Field()
    success: Boolean;

    @Field({ nullable: true })
    data?: string;

    @Field(() => String, { nullable: true })
    error?: String;
}

@InputType()
export class ConciliaDWHInput {
    @Field()
    idDivision: number;

    @Field()
    idCentro: number;

    @Field()
    periodo: number;

    @Field()
    annio: number;

    @Field()
    tipoCentro: number;

    @Field()
    ventasAcumuladas: boolean;
}

export const queryInventarioDWH = `SELECT @Centro as IdCentro, GAM.IdGerencia as IdUnidad, CASE WHEN @Cons = 1 THEN 0 ELSE EP.IdPiso END AS IdPiso, GAM.Mes as Periodo,
    ROUND(SUM(EP.Saldo * EP.PCosto) + SUM(EP.Merma * EP.PCostoMerma) + SUM(EP.MermaOrigen * EP.PCostoMermaOrigen) + SUM(EP.Consignacion * EP.PCostoConsignacion) + SUM(EP.Insumo * EP.PCostoInsumo) + SUM(EP.Inversiones * EP.PCostoInversiones), 2) AS Saldo
    FROM            ExistenciasP AS EP INNER JOIN
    Gerencia_Ano_Mes AS GAM ON GAM.IdGAM = EP.IdGAM INNER JOIN
    UnidadesComerciales.dbo.Almacenes AS A ON GAM.IdGerencia = A.IdUnidad AND A.IdAlmacen = EP.IdPiso
    WHERE        (GAM.Ano = ISNULL(@Anio, GAM.Ano)) AND (GAM.Mes = ISNULL(@Mes, GAM.Mes)) AND (GAM.IdGerencia = CASE WHEN @Unidad = 100 THEN GAM.IdGerencia ELSE @Unidad END) AND A.Consignacion = 0
    GROUP BY GAM.IdGerencia, CASE WHEN @Cons = 1 THEN 0 ELSE EP.IdPiso END, GAM.Mes
    ORDER BY GAM.IdGerencia`;

export const queryVentasDWH = `SELECT @Centro as IdCentro, vt.IdGerencia as IdUnidad, CASE WHEN @Cons = 1 THEN 0 ELSE vt.IdPiso END AS IdPiso, @Mes AS Periodo, SUM(VT.Ventas) AS Saldo
    FROM    (
        -- VENTAS
        SELECT     IdGerencia, V.IdPiso AS IdPiso, G.Mes, MIN(U.Division) AS Div, ROUND(SUM(V.ImporteVenta), 2) AS Ventas
            FROM          Gerencia_Ano_Mes AS G INNER JOIN
                            dbo.VentasDetalle AS V ON G.IdGAM = V.IdGAM INNER JOIN
                            DatosUnid AS U ON G.IdGerencia = U.IdUnidad
            WHERE      (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)
            GROUP BY IdGerencia, V.IdPiso, G.Mes
        UNION ALL   -- VENTAS POR CHEQUES
            SELECT     IdGerencia, V.IdPiso AS IdPiso, G.Mes, MIN(U.Division) AS Div, ROUND(SUM(V.ImporteVenta) , 2) AS Ventas
            FROM         Gerencia_Ano_Mes AS G INNER JOIN
                        dbo.VentasChequeDetalle AS V ON G.IdGAM = V.IdGAM INNER JOIN
                        DatosUnid AS U ON G.IdGerencia = U.IdUnidad
            WHERE     (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)
            GROUP BY IdGerencia, V.IdPiso, G.Mes
        UNION ALL	-- VENTAS COMERCIO ELECTRONICO
            SELECT     IdGerencia, er.IdAlmacen AS IdPiso, G.Mes, MIN(U.Division) AS Div, ROUND(SUM(ED.Cantidad*ED.POperacion * -1) , 2) AS Ventas   --, ROUND(SUM((-1.00*ED.Cantidad*ED.PCosto) , 1) AS VentasCosto
            FROM        dbo.Gerencia_Ano_Mes G INNER JOIN
                        dbo.DatosUnid U ON G.IdGerencia=U.IdUnidad INNER JOIN
                        [dbo].[FacturasCE] F ON F.IdGAM = G.IdGAM INNER JOIN
                        dbo.EntradasSalidasExternasR ER ON ER.IdGAM = F.IdGAM AND ER.IdOperacion = F.IdOperacion INNER JOIN
                        dbo.EntradasSalidasExternasD ED ON ED.IdOperacion = ER.IdOperacion
            WHERE    (Tipo = 'F') AND (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)
            GROUP BY IdGerencia, ER.IdAlmacen, G.Mes
        UNION ALL   --VENTAS MODULO PRESENCIA
            SELECT   IdGerencia, V3.IdPiso, Mes, MIN(U.Division) AS Div, SUM(Ventas) AS Ventas
            FROM
                (SELECT   g.IdGerencia, ER.IdAlmacen AS IdPiso, Mes, SUM(Cantidad * POperacion) * -1 AS Ventas
                FROM       EntradasSalidasExternasR AS ER INNER JOIN EntradasSalidasExternasD AS ED ON ER.IdOperacion = ED.IdOperacion
                        INNER JOIN Gerencia_ano_mes g ON g.Idgam = ER.IdGAM
                        INNER JOIN DatosUnid AS U ON G.IdGerencia = U.IdUnidad
                WHERE (ER.CondCompra = 3) AND (Tipo = 'F') AND (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)
                GROUP BY IdGerencia, ER.IdAlmacen, Mes) V3 INNER JOIN
            dbo.DatosUnid U ON v3.IdGerencia=U.IdUnidad
            GROUP BY IdGerencia, IdPiso, Mes
        UNION ALL   -- PERSONAS NATURALES
            SELECT   IdGerencia, IdPiso, Mes, MIN(U.Division) AS Div, SUM(Ventas) AS Ventas
            FROM
                (SELECT   g.IdGerencia, er.IdAlmacen AS IdPiso, G.Mes, SUM(Cantidad * POperacion) * 24 * -1 AS Ventas
                FROM   EntradasSalidasExternasR AS ER INNER JOIN EntradasSalidasExternasD AS ED ON ER.IdOperacion = ED.IdOperacion
                        INNER JOIN Gerencia_ano_mes g ON g.Idgam = ER.IdGAM
                        INNER JOIN DatosUnid AS U ON G.IdGerencia = U.IdUnidad
                WHERE (ER.CondCompra = 9) AND (ER.IdCuentaFinanciera = '1992') AND (Tipo = 'F') AND (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)
                GROUP BY IdGerencia, ER.IdAlmacen, Mes) V3 INNER JOIN
            dbo.DatosUnid U ON v3.IdGerencia=U.IdUnidad
            GROUP BY IdGerencia, V3.IdPiso, Mes
        UNION ALL   -- VENTAS A TERCEROS
            SELECT   IdGerencia, IdPiso, Mes, MIN(U.Division) AS Div, SUM(Ventas) AS Ventas
            FROM
                (SELECT   g.IdGerencia, er.IdAlmacen AS IdPiso, G.Mes, SUM(Cantidad * POperacion) * -1 AS Ventas
                FROM   EntradasSalidasExternasR AS ER INNER JOIN EntradasSalidasExternasD AS ED ON ER.IdOperacion = ED.IdOperacion
                        INNER JOIN Gerencia_ano_mes g ON g.Idgam = ER.IdGAM
                        INNER JOIN DatosUnid AS U ON G.IdGerencia = U.IdUnidad
                WHERE (ER.CondCompra = 13 AND ER.IdCuentaFinanciera = '6825') AND (Tipo = 'F') AND (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)
                GROUP BY IdGerencia, ER.IdAlmacen, Mes) V3 INNER JOIN
            dbo.DatosUnid U ON v3.IdGerencia=U.IdUnidad
            GROUP BY IdGerencia, V3.IdPiso, Mes
        UNION ALL	-- VENTAS PIEZAS
            SELECT  g.IdGerencia, ER.IdAlmacen AS IdPiso, g.Mes, MIN(U.IdDivision) AS Div, SUM(Cantidad * POperacion) * -1 AS Ventas
            FROM   EntradasSalidasExternasR AS ER INNER JOIN EntradasSalidasExternasD AS ED ON ER.IdOperacion = ED.IdOperacion
                        INNER JOIN Gerencia_ano_mes g ON g.Idgam = ER.IdGAM
                        INNER JOIN DatosUnid AS U ON G.IdGerencia = U.IdUnidad
            WHERE (ER.CondCompra IN (12, 14)) AND (er.IdCuentaFinanciera = '6210') AND (Tipo = 'F') AND (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)
            GROUP BY  g.IdGerencia, ER.IdAlmacen, g.Mes
        UNION ALL	-- VENTAS POST GARANTIA S.TECNICOS
            SELECT   r.IdGerencia, r.IdAlmacen AS IdPiso, G.Mes, MIN(U.Division) AS Div, SUM(ISNULL(d.Importe, 0) + R.TarifaReparacionCUC) AS Ventas
            FROM   Gerencia_Ano_Mes AS G INNER JOIN
                    OrdenServicioPGarantiaResumen r on g.idgam = r.idgam LEFT JOIN
                    (SELECT IdOrden, SUM(Cantidad*PVenta) AS Importe
                        FROM OrdenServicioPGarantiaDetalle
                    GROUP BY IdOrden) d ON r.IdOrden = d.IdOrden INNER JOIN
                    DatosUnid AS U ON G.IdGerencia = U.IdUnidad
            WHERE (r.Inventariado = 1) AND (r.Cancelado = 0) and (G.Ano = @Anio) AND (G.Mes = @Mes) AND (g.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END)  AND (r.IdTipoOrden = 1)
            GROUP  BY r.IdGerencia, r.IdAlmacen, G.Mes
        UNION ALL	-- FACTURAS DE SERVICIOS S.TECNICOS
            SELECT    g.IdGerencia, OSR.IdAlmacen, MONTH(OSR.FechaCierre) AS Mes, MIN(U.IdDivision) AS Div, SUM(OSR.ImpMateriales + ROUND(OSR.ImpMateriales * OSR.Descuento * - 1, 2) + ROUND(OSR.ImpTarifa, 2) + ROUND(OSR.ImpTarifa * OSR.DescuentoMO * -1, 2)) AS Ventas
            FROM	OrdenesACResumen OSR INNER JOIN
                    dbo.Gerencia_Ano_Mes AS G ON G.IdGAM = OSR.IdGAM INNER JOIN
                    DatosUnid AS U ON G.IdGerencia = U.IdUnidad
            WHERE (G.IdGerencia = CASE WHEN @Unidad = 100 THEN g.IdGerencia ELSE @Unidad END) AND (YEAR(OSR.FechaCierre) = @Anio) AND (MONTH(OSR.FechaCierre) = @Mes) AND (OSR.IdCuentaFinanciera LIKE 'P%') AND (OSR.Inventariado = 1) AND (OSR.Cancelado = 0)
            GROUP BY g.IdGAM, g.IdGerencia, OSR.IdAlmacen, G.Ano, MONTH(OSR.FechaCierre)
    ) AS VT
    GROUP BY VT.IdGerencia, CASE WHEN @Cons = 1 THEN 0 ELSE vt.IdPiso END
    ORDER BY VT.IdGerencia`;

export const queryRodasDWHInventarioVentas = `SELECT 'Inventario' as Tipo, IdCentro, V.IdUnidad, RTRIM(V.IdUnidad) + '-' + U.Nombre AS Unidad, IdPiso, Almacen,
    SUM(SaldoGolden) AS SaldoGolden, SUM(SaldoRestaurador) AS SaldoRestaurador, SUM(DifGoldenRest) as DifGoldenRest,
    SUM(SaldoDistribuidor) AS SaldoDistribuidor, SUM(DifGoldenDist) AS DifGoldenDist,
    SUM(SaldoRodas) AS SaldoRodas, SUM(DifGoldenRodas) AS DifGoldenRodas,
    Cuenta, Periodo, U.IdDivision, RTRIM(U.IdDivision) + '-' + U.Division AS Division
    FROM            vDWG_Rodas_Inventario AS V INNER JOIN
    dbo.vCentros AS U ON U.IdUnidad = V.IdUnidad
    GROUP BY IdCentro, V.IdUnidad, U.Nombre, IdPiso, Almacen, Cuenta, Periodo, U.IdDivision, U.Division
    HAVING        (IdCentro = @IdCentro) AND (Periodo = @Periodo) AND (SUM(SaldoGolden) + SUM(SaldoRestaurador) + SUM(SaldoDistribuidor) + SUM(SaldoRodas) NOT BETWEEN - 0.0001 AND 0.0001)
UNION all
    SELECT 'Ventas' as Tipo, IdCentro, V.IdUnidad, RTRIM(V.IdUnidad) + '-' + U.Nombre AS Unidad, IdPiso, Almacen,
    SUM(SaldoGolden) AS SaldoGolden, SUM(SaldoRestaurador) AS SaldoRestaurador, SUM(V.DifGoldenRest) AS DifGoldenRest,
    SUM(SaldoDistribuidor) AS SaldoDistribuidor, SUM(V.DifGoldenDist) AS DifGoldenDist,
    SUM(SaldoRodas) AS SaldoRodas, SUM(V.DifGoldenRodas) AS DifGoldenRodas, Cuenta, Periodo, U.IdDivision, RTRIM(U.IdDivision) + '-' + U.Division AS Division
    FROM            vDWG_Rodas_Ventas AS V INNER JOIN
            dbo.vCentros AS U ON U.IdUnidad = V.IdUnidad
    GROUP BY Periodo, IdCentro, V.IdUnidad, U.Nombre, IdPiso, Almacen, Cuenta, U.IdDivision, U.Division
    HAVING        (IdCentro = @IdCentro) AND (Periodo = @Periodo)
    ORDER BY IdCentro, IdUnidad, Tipo, IdPiso`;

export const queryRodasDWHInventarioVentasResumen = `SELECT 'Inventario' as Tipo, IdCentro, V.IdUnidad, RTRIM(V.IdUnidad) + '-' + U.Nombre AS Unidad, '000' AS IdPiso, '' AS Almacen,
    SUM(SaldoGolden) AS SaldoGolden, SUM(SaldoRestaurador) AS SaldoRestaurador, SUM(DifGoldenRest) as DifGoldenRest,
    SUM(SaldoDistribuidor) AS SaldoDistribuidor, SUM(DifGoldenDist) AS DifGoldenDist,
    SUM(SaldoRodas) AS SaldoRodas, SUM(DifGoldenRodas) AS DifGoldenRodas,
    '' AS Cuenta, Periodo, U.IdDivision, RTRIM(U.IdDivision) + '-' + U.Division AS Division
    FROM            vDWG_Rodas_Inventario AS V INNER JOIN
    dbo.vCentros AS U ON U.IdUnidad = V.IdUnidad
    GROUP BY IdCentro, V.IdUnidad, U.Nombre, Periodo, U.IdDivision, U.Division
    HAVING        (IdCentro = @IdCentro) AND (Periodo = @Periodo) AND (SUM(SaldoGolden) + SUM(SaldoRestaurador) + SUM(SaldoDistribuidor) + SUM(SaldoRodas) NOT BETWEEN - 0.0001 AND 0.0001)
UNION ALL
    SELECT 'Ventas' as Tipo, IdCentro, V.IdUnidad, RTRIM(V.IdUnidad) + '-' + U.Nombre AS Unidad, '000' AS IdPiso, '' AS Almacen,
    SUM(SaldoGolden) AS SaldoGolden, SUM(SaldoRestaurador) AS SaldoRestaurador, SUM(V.DifGoldenRest) AS DifGoldenRest,
    SUM(SaldoDistribuidor) AS SaldoDistribuidor, SUM(V.DifGoldenDist) AS DifGoldenDist,
    SUM(SaldoRodas) AS SaldoRodas, SUM(V.DifGoldenRodas) AS DifGoldenRodas,
    '' AS Cuenta, Periodo, U.IdDivision, RTRIM(U.IdDivision) + '-' + U.Division AS Division
    FROM            vDWG_Rodas_Ventas AS V INNER JOIN
            dbo.vCentros AS U ON U.IdUnidad = V.IdUnidad
    GROUP BY Periodo, IdCentro, V.IdUnidad, U.Nombre, U.IdDivision, U.Division
    HAVING        (IdCentro = @IdCentro) AND (Periodo = @Periodo)
    ORDER BY IdCentro, U.IdDivision, Tipo, IdUnidad, IdPiso`;

export const queryRodasDWHAlmacenes = `SELECT IdCentro, RTRIM(C.IdUnidad) + '-' + C.Nombre AS Centro, A.IdUnidad, RTRIM(U.IdUnidad) + '-' + U.Nombre AS Unidad, IdPiso, Almacen, CuentaG, CuentaR, Periodo
    FROM vDWG_Rodas_Almacenes AS A INNER JOIN
        dbo.vCentros AS C ON C.IdUnidad = A.IdCentro INNER JOIN
        dbo.vCentros AS U ON U.IdUnidad = A.IdUnidad
    WHERE (IdCentro = @IdCentro) AND (Periodo = @Periodo)
    ORDER BY IdCentro, IdUnidad, IdPiso`;

export const queryRodasDWHAlmacenesDist = `SELECT Almacen, CuentaG, CuentaR, IdCentro, IdPiso, IdUnidad
    FROM            vDWH_Almacenes_GoldenVsDistribuidor
    WHERE        (IdCentro = @IdCentro)
    ORDER BY IdCentro, IdUnidad, IdPiso`;

export const queryRodasDWHNota = `SELECT Nota FROM DWH_Nota WHERE (IdCentro = @IdCentro) AND (Periodo = @Periodo) AND (Año = @Anio)`;
