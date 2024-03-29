import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ConciliaDWH {
  @Field({ name: 'Tipo' })
  tipo: string;

  @Field({ name: 'IdCentro' })
  id_centro: number;

  @Field({ name: 'Centro' })
  centro: string;

  @Field({ name: 'IdUnidad' })
  id_unidad: string;

  @Field({ name: 'Unidad' })
  unidad: string;

  @Field({ name: 'IdPiso' })
  id_piso: string;

  @Field({ name: 'Almacen', nullable: true })
  almacen?: string;

  @Field({ name: 'Cuenta', nullable: true })
  cuenta?: string;

  @Field({ name: 'Periodo' })
  periodo: string;

  @Field({ name: 'SaldoGolden' })
  saldo_golden: number;

  @Field({ name: 'SaldoRestaurador' })
  saldo_restaurador: number;

  @Field({ name: 'DifGoldenRest' })
  dif_golden_rest: number;

  @Field({ name: 'SaldoDistribuidor' })
  saldo_distribuidor: number;

  @Field({ name: 'DifGoldenDist' })
  dif_golden_dist: number;

  @Field({ name: 'SaldoRodas' })
  saldo_rodas: number;

  @Field({ name: 'DifGoldenRodas' })
  dif_golden_rodas: number;

  @Field({ name: 'IdDivision' })
  id_division: number;

  @Field({ name: 'Division' })
  division: string;

  @Field({ name: 'CuentaR', nullable: true })
  cuenta_r?: string;

  @Field({ name: 'Nota', nullable: true })
  nota?: string;
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

export const queryInventarioDWH = `SELECT @Centro as id_centro, GAM.IdGerencia as id_unidad, CASE WHEN @Cons = 1 THEN 0 ELSE EP.IdPiso END AS id_piso, GAM.Mes as periodo,
    ROUND(SUM(EP.Saldo * EP.PCosto) + SUM(EP.Merma * EP.PCostoMerma) + SUM(EP.MermaOrigen * EP.PCostoMermaOrigen) + SUM(EP.Consignacion * EP.PCostoConsignacion) + SUM(EP.Insumo * EP.PCostoInsumo) + SUM(EP.Inversiones * EP.PCostoInversiones), 2) AS saldo
    FROM            ExistenciasP AS EP INNER JOIN
    Gerencia_Ano_Mes AS GAM ON GAM.IdGAM = EP.IdGAM INNER JOIN
    UnidadesComerciales.dbo.Almacenes AS A ON GAM.IdGerencia = A.IdUnidad AND A.IdAlmacen = EP.IdPiso
    WHERE        (GAM.Ano = ISNULL(@Anio, GAM.Ano)) AND (GAM.Mes = ISNULL(@Mes, GAM.Mes)) AND (GAM.IdGerencia = CASE WHEN @Unidad = 100 THEN GAM.IdGerencia ELSE @Unidad END) AND A.Consignacion = 0 AND (SELECT TOP 1 CONVERT(INT, Valor) FROM ConvertSplitStringToTable(A.EContable, '-')) >= 100 
    GROUP BY GAM.IdGerencia, CASE WHEN @Cons = 1 THEN 0 ELSE EP.IdPiso END, GAM.Mes
    ORDER BY GAM.IdGerencia`;

export const queryVentasDWH = `SELECT @Centro as id_centro, vt.IdGerencia as id_unidad, CASE WHEN @Cons = 1 THEN 0 ELSE vt.IdPiso END AS id_piso, @Mes AS periodo, SUM(VT.Ventas) AS saldo
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
