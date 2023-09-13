import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConciliaUH {
  @Field({ name: 'Tipo' })
  tipo: string;

  @Field({ name: 'IdDivision' })
  id_division: number;

  @Field({ name: 'Division' })
  division: string;

  @Field({ name: 'SubDivision' })
  subdivision: string;

  @Field({ name: 'Centro' })
  centro: string;

  @Field({ name: 'IdCentro' })
  id_centro: number;

  @Field({ name: 'IdUnidad' })
  id_unidad: number;

  @Field({ name: 'Unidad' })
  unidad: string;

  @Field({ name: 'Periodo' })
  periodo: number;

  @Field({ name: 'Cuenta' })
  cuenta: string;

  @Field({ name: 'SubCuenta' })
  subcuenta: string;

  @Field({ name: 'Analisis1', nullable: true })
  analisis_1?: string;

  @Field({ name: 'Analisis2', nullable: true })
  analisis_2?: string;

  @Field({ name: 'Analisis3', nullable: true })
  analisis_3?: string;

  @Field({ name: 'Analisis4', nullable: true })
  analisis_4?: string;

  @Field({ name: 'Analisis5', nullable: true })
  analisis_5?: string;

  @Field({ name: 'SaldoUH' })
  saldo_uh: number;

  @Field({ name: 'SaldoRodas' })
  saldo_rodas: number;

  @Field({ name: 'Diferencia' })
  diferencia: number;
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

export const queryUhCategorias = `SELECT p.codigo_categoria, categoria, cuenta_u as cuenta_mn, subcuenta_u as subcuenta_mn, analisis_1_u as analisis_1_mn, analisis_2_u as analisis_2_mn, analisis_3_u as analisis_3_mn, analisis_4_u as analisis_4_mn, analisis_5_u as analisis_5_mn, cuenta_u_cuc as cuenta_mlc, subcuenta_u_cuc as subcuenta_mlc, analisis_1_u_cuc as analisis_1_mlc, analisis_2_u_cuc as analisis_2_mlc, analisis_3_u_cuc as analisis_3_mlc, analisis_4_u_cuc as analisis_4_mlc, analisis_5_u_cuc as analisis_5_mlc, cuenta_d as cuenta_mnd, subcuenta_d as subcuenta_mnd, analisis_1_d as analisis_1_mnd, analisis_2_d as analisis_2_mnd, analisis_3_d as analisis_3_mnd, analisis_4_d as analisis_4_mnd, analisis_5_d as analisis_5_mnd, cuenta_d_cuc as cuenta_mlcd, subcuenta_d_cuc as subcuenta_mlcd, analisis_1_d_cuc as analisis_1_mlcd, analisis_2_d_cuc as analisis_2_mlcd, analisis_3_d_cuc as analisis_3_mlcd, analisis_4_d_cuc as analisis_4_mlcd, analisis_5_d_cuc as analisis_5_mlcd, cuenta_g as cuenta_mng, subcuenta_g as subcuenta_mng, analisis_1_g as analisis_1_mng, analisis_2_g as analisis_2_mng, analisis_3_g as analisis_3_mng, analisis_4_g as analisis_4_mng, analisis_5_g as analisis_5_mng, cuenta_g_cuc as cuenta_mlcg, subcuenta_g_cuc as subcuenta_mlcg, analisis_1_g_cuc as analisis_1_mlcg, analisis_2_g_cuc as analisis_2_mlcg, analisis_3_g_cuc as analisis_3_mlcg, analisis_4_g_cuc as analisis_4_mlcg, analisis_5_g_cuc as analisis_5_mlcg
    FROM utileshrr.parametros_categorias as p inner join utileshrr.tipos_categorias as c on c.codigo_categoria = p.codigo_categoria and c.anno = p.anno
    WHERE p.anno = @anno;`;

export const queryUhProductos = `SELECT codigo_util, descripcion, codigo_categoria, um, periodo_propuesta, periodo_chequeado, elemento, elemento_cuc as elemento_mlc
    FROM utileshrr.utiles
    WHERE anno = @anno;`;

export const queryUh = `SELECT CASE WHEN Cat.analisis_1_u = 'CCOSTO' OR Cat.analisis_2_u = 'CCOSTO' OR Cat.analisis_3_u = 'CCOSTO' OR Cat.analisis_4_u = 'CCOSTO' OR Cat.analisis_5_u = 'CCOSTO' THEN Trab.codigo_ccosto ELSE '@centro' END AS Id_Unidad, 
    inv.anno, Inv.periodo AS periodo, Inv.codigo_util, Inv.codigo_trabajador, Inv.codigo_area, Inv.existencia,
	Inv.importe, Inv.importe_cuc as importe_mlc, Inv.desgaste, Inv.desgaste_cuc as desgaste_mlc
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
		where hist.existencia is null and inv.anno = @anno and conf.anno = @anno and conf.periodo = @periodo
    ) AS Inv INNER JOIN
    utileshrr.utiles AS Prod ON Prod.codigo_util = Inv.codigo_util and inv.anno = prod.anno INNER JOIN
    utileshrr.parametros_categorias AS Cat ON Cat.codigo_categoria = Prod.codigo_categoria and cat.anno = prod.anno INNER JOIN
    utileshrr.responsables AS Trab ON Trab.codigo_trabajador = Inv.codigo_trabajador AND Trab.codigo_area = Inv.codigo_area and trab.anno = inv.anno;`;
