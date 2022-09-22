import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConciliaUH {
    @Field()
    Division: string;

    @Field()
    SubDivision: string;

    @Field()
    Tipo: string;

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
    Cta: string;

    @Field()
    Scta: string;

    @Field()
    An1: string;

    @Field()
    An2: string;

    @Field()
    An3: string;

    @Field()
    Saldo_AF: number;

    @Field()
    Saldo_Rodas: number;

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

export const queryUhUltimoPeriodo = `SELECT ISNULL(MAX(Per),0) FROM TbHistorial`;

export const queryUhSinCuentas = `SELECT TOP 1 *
    FROM dbo.TbCategorias
    WHERE CuentaMN = '' OR CuentaMN IS NULL OR CuentaMND = '' OR CuentaMND IS NULL`;

export const queryUhCategorias = `SELECT CodCategoria, Categoria, CuentaMN, SubCuentaMN, Analisis1MN, Analisis2MN, Analisis3MN, CuentaMLC, SubCuentaMLC, Analisis1MLC, Analisis2MLC, Analisis3MLC, CuentaMND, SubCuentaMND, Analisis1MND, 
    Analisis2MND, Analisis3MND, CuentaMLCD, SubCuentaMLCD, Analisis1MLCD, Analisis2MLCD, Analisis3MLCD, CuentaMNG, SubCuentaMNG, Analisis1MNG, Analisis2MNG, Analisis3MNG, CuentaMLCG, SubCuentaMLCG, 
    Analisis1MLCG, Analisis2MLCG, Analisis3MLCG
    FROM TbCategorias`;

export const queryUhProductos = `SELECT Codig_PRODUCTO, DESCRIP_PRODUCTO, UM, Per_Propuesto, Per_Chequeado, CodCategoria 
    FROM dbo.TbProducto`;

export const queryUhHistorial = `SELECT  CASE WHEN @isComplejo = 1 THEN Trab.Codig_CCosto ELSE @idCentro END AS Unidad, 
    Inv.Per AS Periodo, Inv.Codig_Producto, Inv.Codig_Trabajador, Inv.Codig_Area, Inv.Existencia,
    Inv.Importe_MN_p, Inv.Importe_MLC_p, Inv.Depreciacion_MN_p, Inv.Depreciacion_MLC_p
    FROM dbo.TbHistorial AS Inv INNER JOIN
    dbo.TbProducto AS Prod ON Prod.Codig_PRODUCTO = Inv.Codig_Producto INNER JOIN
    dbo.TbCategorias AS Cat ON Cat.CodCategoria = Prod.CodCategoria INNER JOIN
    dbo.TbTrabajador AS Trab ON Trab.Codig_Trabajador = Inv.Codig_Trabajador AND Trab.Codig_Area = Inv.Codig_Area`;

export const queryUh = `SELECT CASE WHEN @isComplejo = 1 THEN Trab.Codig_CCosto ELSE @idCentro END AS Unidad, 
    @Periodo AS Periodo, Inv.Codig_Producto, Inv.Codig_Trabajador, Inv.Codig_Area, Inv.Existencia, 
    Inv.Importe_MN_p, Inv.Importe_MLC_p, Inv.Depreciacion_MN_p, Inv.Depreciacion_MLC_p
    FROM TbActa AS Inv INNER JOIN
    TbProducto AS Prod ON Prod.Codig_PRODUCTO = Inv.Codig_Producto INNER JOIN
    TbCategorias AS Cat ON Cat.CodCategoria = Prod.CodCategoria INNER JOIN
    TbTrabajador AS Trab ON Trab.Codig_Trabajador = Inv.Codig_Trabajador AND Trab.Codig_Area = Inv.Codig_Area`;

export const querySiscoUltimoPeriodoUH = `SELECT ISNULL(MAX(Periodo),0) as Periodo FROM Utiles_Inventario WHERE IdCentro = @Centro`;
