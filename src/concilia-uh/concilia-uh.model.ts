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
  Analisis4: string;

  @Field()
  Analisis5: string;

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

export const queryUhCategorias = `SELECT p.codigo_categoria, categoria, cuenta_u, subcuenta_u, analisis_1_u, analisis_2_u, analisis_3_u, analisis_4_u, analisis_5_u, cuenta_u_cuc, subcuenta_u_cuc, analisis_1_u_cuc, analisis_2_u_cuc, analisis_3_u_cuc, analisis_4_u_cuc, analisis_5_u_cuc, cuenta_d, subcuenta_d, analisis_1_d, analisis_2_d, analisis_3_d, analisis_4_d, analisis_5_d, cuenta_d_cuc, subcuenta_d_cuc, analisis_1_d_cuc, analisis_2_d_cuc, analisis_3_d_cuc, analisis_4_d_cuc, analisis_5_d_cuc, cuenta_g, subcuenta_g, analisis_1_g, analisis_2_g, analisis_3_g, analisis_4_g, analisis_5_g, cuenta_g_cuc, subcuenta_g_cuc, analisis_1_g_cuc, analisis_2_g_cuc, analisis_3_g_cuc, analisis_4_g_cuc, analisis_5_g_cuc
    FROM utileshrr.parametros_categorias as p inner join utileshrr.tipos_categorias as c on c.codigo_categoria = p.codigo_categoria
    WHERE p.anno = @anno;`;

export const queryUhProductos = `SELECT codigo_util, descripcion, codigo_categoria, um, periodo_propuesta, periodo_chequeado, elemento, elemento_cuc
    FROM utileshrr.utiles
    WHERE anno = @anno;`;

export const queryUh = `SELECT CASE WHEN Cat.analisis_1_u = 'CCOSTO' OR Cat.analisis_2_u = 'CCOSTO' OR Cat.analisis_3_u = 'CCOSTO' OR Cat.analisis_4_u = 'CCOSTO' OR Cat.analisis_5_u = 'CCOSTO' THEN Trab.codigo_ccosto ELSE '@centro' END AS Id_Unidad, 
    inv.anno, Inv.periodo AS periodo, Inv.codigo_util, Inv.codigo_trabajador, Inv.codigo_area, Inv.existencia,
	Inv.importe, Inv.importe_cuc, Inv.desgaste, Inv.desgaste_cuc
    FROM (
        SELECT inv.anno, Inv.periodo AS periodo, Inv.codigo_util, Inv.codigo_trabajador, Inv.codigo_area, Inv.existencia,
            Inv.importe, Inv.importe_cuc, Inv.desgaste, Inv.desgaste_cuc
            FROM utileshrr.historial AS Inv 
			WHERE inv.anno = @anno and inv.periodo = @periodo
        UNION ALL
        SELECT inv.anno, conf.periodo AS periodo, Inv.codigo_util, Inv.codigo_trabajador, Inv.codigo_area, Inv.existencia,
            Inv.importe, Inv.importe_cuc, Inv.desgaste, Inv.desgaste_cuc
            FROM utileshrr.acta_responsabilidad AS Inv CROSS JOIN
            utileshrr.configuracion AS Conf left join 
			utileshrr.historial as hist on hist.anno = conf.anno and hist.periodo = conf.periodo and 
				inv.anno = hist.anno and inv.codigo_trabajador = hist.codigo_trabajador and 
				inv.codigo_area = hist.codigo_area and inv.codigo_util = hist.codigo_util
		where hist.existencia is null and conf.anno = @anno and conf.periodo = @periodo
    ) AS Inv INNER JOIN
    utileshrr.utiles AS Prod ON Prod.codigo_util = Inv.codigo_util INNER JOIN
    utileshrr.parametros_categorias AS Cat ON Cat.codigo_categoria = Prod.codigo_categoria INNER JOIN
    utileshrr.responsables AS Trab ON Trab.codigo_trabajador = Inv.codigo_trabajador AND Trab.codigo_area = Inv.codigo_area;`;
