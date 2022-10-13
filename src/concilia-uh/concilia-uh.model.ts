import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConciliaUH {
    @Field()
    Tipo: string;

    @Field()
    IdDivision: number;

    @Field()
    Division: string;

    @Field()
    SubDivision: string;

    @Field()
    Centro: string;

    @Field()
    IdCentro: number;

    @Field()
    IdUnidad: number;

    @Field()
    Unidad: string;

    @Field()
    Periodo: number;

    @Field()
    Cuenta: string;

    @Field()
    SubCuenta: string;

    @Field()
    Analisis1: string;

    @Field()
    Analisis2: string;

    @Field()
    Analisis3: string;

    @Field()
    SaldoUH: number;

    @Field()
    SaldoRodas: number;

    @Field()
    Diferencia: number;
}

@InputType()
export class ConciliaUhInput {
    @Field()
    idCentro: number;

    @Field()
    periodo: number;

    @Field()
    annio: number;
}

export const queryUhCategorias = `SELECT CodCategoria, Categoria, CuentaMN, SubCuentaMN, Analisis1MN, Analisis2MN, Analisis3MN, CuentaMLC, SubCuentaMLC, Analisis1MLC, Analisis2MLC, Analisis3MLC, CuentaMND, SubCuentaMND, Analisis1MND, 
    Analisis2MND, Analisis3MND, CuentaMLCD, SubCuentaMLCD, Analisis1MLCD, Analisis2MLCD, Analisis3MLCD, CuentaMNG, SubCuentaMNG, Analisis1MNG, Analisis2MNG, Analisis3MNG, CuentaMLCG, SubCuentaMLCG, 
    Analisis1MLCG, Analisis2MLCG, Analisis3MLCG
    FROM TbCategorias`;

export const queryUhProductos = `SELECT Codig_PRODUCTO, DESCRIP_PRODUCTO, UM, Per_Propuesto, Per_Chequeado, CodCategoria 
    FROM dbo.TbProducto`;

export const queryUh = `SELECT CASE WHEN Cat.Analisis1MN = 'CCOSTO' OR Cat.Analisis2MN = 'CCOSTO' OR Cat.Analisis3MN = 'CCOSTO' THEN Trab.Codig_CCosto ELSE @Centro END AS IdUnidad, 
    Inv.Periodo AS Periodo, Inv.Codig_Producto, Inv.Codig_Trabajador, Inv.Codig_Area, Inv.Existencia,
    Inv.Importe_MN_p, Inv.Importe_MLC_p, Inv.Depreciacion_MN_p, Inv.Depreciacion_MLC_p
    FROM (
        SELECT Inv.Per AS Periodo, Inv.Codig_Producto, Inv.Codig_Trabajador, Inv.Codig_Area, Inv.Existencia,
            Inv.Importe_MN_p, Inv.Importe_MLC_p, Inv.Depreciacion_MN_p, Inv.Depreciacion_MLC_p
            FROM dbo.TbHistorial AS Inv 
        UNION ALL
        SELECT Conf.Periodo AS Periodo, Inv.Codig_Producto, Inv.Codig_Trabajador, Inv.Codig_Area, Inv.Existencia, 
            Inv.Importe_MN_p, Inv.Importe_MLC_p, Inv.Depreciacion_MN_p, Inv.Depreciacion_MLC_p
            FROM TbActa AS Inv CROSS JOIN
        dbo.TbConfiguracion AS Conf
    ) AS Inv INNER JOIN
    TbProducto AS Prod ON Prod.Codig_PRODUCTO = Inv.Codig_Producto INNER JOIN
    TbCategorias AS Cat ON Cat.CodCategoria = Prod.CodCategoria INNER JOIN
    TbTrabajador AS Trab ON Trab.Codig_Trabajador = Inv.Codig_Trabajador AND Trab.Codig_Area = Inv.Codig_Area 
    WHERE Inv.Periodo = @Periodo`;
