import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ConciliaAFT {
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

@ObjectType()
export class DiferenciaClasificadorCNMB {
  @Field()
  Unidad: string;

  @Field()
  CNMB: string;

  @Field()
  DCNMB: string;

  @Field()
  TREPO: number;

  @Field()
  TREPO_UC: number;
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

export const queryMb = `SELECT CASE WHEN C.cri1 = 'Y' THEN Inv.Anal1 WHEN C.cri2 = 'Y' THEN Inv.Anal2 WHEN C.cri3 = 'Y' THEN Inv.Anal3 ELSE @Centro END AS IdUnidad, Inv.periodo, Inv.Submayor, Inv.Inventa, 
  Inv.CtaSCta, Inv.Anal1, Inv.Anal2, Inv.Anal3, 
  Inv.CtaSCtaD, Inv.AnD1, Inv.AnD2, Inv.AnD3, Inv.CtaSctaG, Inv.AnG1, Inv.AnG2, Inv.AnG3, 
  Inv.ValorI, Inv.Repara, Inv.UDepP, Inv.DepAc, Inv.TasaD, Inv.ALEX, Inv.Area, Inv.Revalorizacion, Inv.mbaja, Inv.malta
  FROM (
    SELECT MB.periodo, MB.Submayor, MB.Inventa, MB.CtaSCta, MB.Anal1, MB.Anal2, MB.Anal3, 
      MB.CtaSCtaD, MB.AnD1, MB.AnD2, MB.AnD3, MB.CtaSctaG, MB.AnG1, MB.AnG2, MB.AnG3, 
      MB.ValorI, MB.Repara, MB.UDepP, MB.DepAc, MB.TasaD, MB.ALEX, MB.Area, MB.Revalorizacion, MB.mbaja, MB.malta 
    FROM dbo.Mb_periodo AS MB
    WHERE MB.periodo = @Periodo
    UNION ALL
    SELECT Conf.PeríodoA AS periodo, MB.Submayor, MB.Inventa, MB.CtaSCta, MB.Anal1, MB.Anal2, MB.Anal3, 
      MB.CtaSCtaD, MB.AnD1, MB.AnD2, MB.AnD3, MB.CtaSctaG, MB.AnG1, MB.AnG2, MB.AnG3, 
      MB.ValorI, MB.Repara, MB.UDepP, MB.DepAc, MB.TasaD, MB.ALEX, MB.Area, MB.Revalorizacion, MB.mbaja, MB.malta 
    FROM dbo.Mb AS MB CROSS JOIN
    dbo.Configura AS Conf 
    WHERE CASE  WHEN CAST(Conf.PeríodoA AS INT) = 1 THEN Conf.Ene
            WHEN CAST(Conf.PeríodoA AS INT) = 2 THEN Conf.Feb
            WHEN CAST(Conf.PeríodoA AS INT) = 3 THEN Conf.Mar
            WHEN CAST(Conf.PeríodoA AS INT) = 4 THEN Conf.Abr
            WHEN CAST(Conf.PeríodoA AS INT) = 5 THEN Conf.May
            WHEN CAST(Conf.PeríodoA AS INT) = 6 THEN Conf.Jun
            WHEN CAST(Conf.PeríodoA AS INT) = 7 THEN Conf.Jul
            WHEN CAST(Conf.PeríodoA AS INT) = 8 THEN Conf.Ago
            WHEN CAST(Conf.PeríodoA AS INT) = 9 THEN Conf.Sep
            WHEN CAST(Conf.PeríodoA AS INT) = 10 THEN Conf.Oct
            WHEN CAST(Conf.PeríodoA AS INT) = 11 THEN Conf.Nov
            WHEN CAST(Conf.PeríodoA AS INT) = 12 THEN Conf.Dic END = 0
  ) AS Inv INNER JOIN dbo.Cuentas AS C ON C.CtaSCta COLLATE SQL_Latin1_General_CP1_CI_AS = Inv.CtaSCta COLLATE SQL_Latin1_General_CP1_CI_AS`;
