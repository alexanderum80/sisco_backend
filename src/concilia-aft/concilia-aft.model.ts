import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ConciliaAFT {
  @Field({ name: 'Division' })
  division: string;

  @Field({ name: 'SubDivision' })
  subdivision: string;

  @Field({ name: 'Tipo' })
  tipo: string;

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

  @Field({ name: 'Cta' })
  cta: string;

  @Field({ name: 'Scta' })
  scta: string;

  @Field({ name: 'An1' })
  an1: string;

  @Field({ name: 'An2' })
  an2: string;

  @Field({ name: 'An3' })
  an3: string;

  @Field({ name: 'Saldo_AF' })
  saldo_af: number;

  @Field({ name: 'Saldo_Rodas' })
  saldo_rodas: number;

  @Field({ name: 'Diferencia' })
  diferencia: number;
}

@ObjectType()
export class DiferenciaClasificadorCNMB {
  @Field({ name: 'Unidad' })
  unidad: string;

  @Field({ name: 'Grupo' })
  grupo: number;

  @Field({ name: 'Codigo' })
  codigo: number;

  @Field({ name: 'Descripcion' })
  descripcion: string;

  @Field({ name: 'Deprecia' })
  deprecia: boolean;

  @Field({ name: 'TasaUC' })
  tasa_uc: number;

  @Field({ name: 'Tasa' })
  tasa: number;
}

@ObjectType()
export class ConciliaAftData {
  @Field(() => [ConciliaAFT], { nullable: true })
  ConciliaAFT?: ConciliaAFT[];

  @Field(() => [DiferenciaClasificadorCNMB], { nullable: true })
  DiferenciaClasificadorCNMB?: DiferenciaClasificadorCNMB[];
}

@InputType()
export class ConciliaAftInput {
  @Field()
  idCentro: number;

  @Field()
  periodo: number;

  @Field()
  annio: number;
}

export const queryMbSubgrupos = `SELECT grupo, codigo, descripcion, deprecia, tasa, cuenta_activo, subcuenta_activo, cuenta_depreciacion, subcuenta_depreciacion, anno, cuenta_gasto, subcuenta_gasto, analisis_1, analisis_2, analisis_3, analisis_1_depreciacion, analisis_2_depreciacion, analisis_3_depreciacion, analisis_1_gasto, analisis_2_gasto, analisis_3_gasto, origen_analisis_1, origen_analisis_2, origen_analisis_3, origen_analisis_1_depreciacion, origen_analisis_2_depreciacion, origen_analisis_3_depreciacion, origen_analisis_1_gasto, origen_analisis_2_gasto, origen_analisis_3_gasto, criterio_analisis_1, criterio_analisis_2, criterio_analisis_3, criterio_analisis_1_depreciacion, criterio_analisis_2_depreciacion, criterio_analisis_3_depreciacion, criterio_analisis_1_gasto, criterio_analisis_2_gasto, criterio_analisis_3_gasto
  FROM activos.subgrupos
  WHERE anno = @anno;`;

export const queryMbSinCuentas = `SELECT codigo FROM activos.activos 
  WHERE cuenta IS NULL OR cuenta = '' OR cuenta_depreciacion IS NULL OR cuenta_depreciacion = ''`;

export const queryMb = `select case when cta.tipo_analisis_1 = 'Y' then a.analisis_1 when cta.tipo_analisis_2 = 'Y' then a.analisis_2 when cta.tipo_analisis_3 = 'Y' then a.analisis_3 else @Centro::text end as id_unidad,
    c.periodo, a.grupo, a.subgrupo, a.codigo, a.descripcion, a.tipo, a.valor_inicial, a.valor, a.depreciacion, a.area_responsabilidad, a.centro_costo, a.estado, a.tipo_documento_alta, a.documento_alta, a.tipo_documento_baja, a.documento_baja, 
    a.cuenta, a.subcuenta, a.analisis_1, a.analisis_2, a.analisis_3, 
    a.cuenta_depreciacion, a.subcuenta_depreciacion, a.analisis_1_depreciacion, a.analisis_2_depreciacion, a.analisis_3_depreciacion, 
    a.cuenta_gasto, a.subcuenta_gasto, a.analisis_1_gasto, a.analisis_2_gasto, a.analisis_3_gasto, 
    a.anno_fabricacion, a.subtipo, a.anno_documento, a.fecha_puesta_marcha, a.anno_baja, a.pais, a.marca, a.modelo, a.no_serie, a.combustible, 
    a.potencia, a.tonelaje, a.nro_motor, a.nro_chapa, a.nro_chasis, a.agregados, a.ctipo_activo, a.tasa, a.nchr_marcadoreajustar, a.reajustado
  FROM activos.activos as a inner join 
    contabilidad.cuentas cta on a.cuenta = cta.cuenta and a.subcuenta = cta.subcuenta and cta.anno = @Anno cross join 
    activos.configuracion c
  where c.anno = @anno and c.periodo = @periodo;`;
