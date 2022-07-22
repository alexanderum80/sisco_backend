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

export const queryMbClanaCNMB = `SELECT CNMB, DCNMB, TREPO FROM dbo.CLANACMB`;

export const queryMbUltimoPeriodo = `SELECT ISNULL(MAX(Periodo),0) as Periodo FROM MB_Periodo`;

export const queryMbSinCuentas = `SELECT Inventa FROM dbo.MB WHERE CtaSCta IS NULL OR CtaSCta = '' OR CtaSCtaD IS NULL OR CtaSCtaD = ''`;

export const queryMbPeriodo = `SELECT CASE WHEN C.cri1 = 'Y' THEN MB.Anal1 WHEN C.cri2 = 'Y' THEN MB.Anal2 WHEN C.cri3 = 'Y' THEN MB.Anal3 ELSE @Centro END AS IdUnidad, MB.* 
    FROM dbo.Mb_periodo AS MB INNER JOIN dbo.Cuentas AS C ON C.CtaSCta = MB.CtaSCta
    WHERE MB.periodo = @Periodo`;

export const queryMb = `SELECT CASE WHEN C.cri1 = 'Y' THEN MB.Anal1 WHEN C.cri2 = 'Y' THEN MB.Anal2 WHEN C.cri3 = 'Y' THEN MB.Anal3 ELSE @Centro END AS IdUnidad, @Periodo AS periodo, 
    MB.Submayor, MB.Inventa, MB.CtaSCta, MB.Anal1, MB.Anal2, MB.Anal3, MB.CtaSCtaD, MB.AnD1, MB.AnD2, MB.AnD3, MB.CtaSctaG, MB.AnG1, MB.AnG2, MB.AnG3, MB.ValorI, MB.Repara, 
    MB.UDepP, MB.DepAc, MB.TasaD, MB.ALEX, MB.Area, MB.Revalorizacion, MB.mbaja, MB.malta 
    FROM dbo.Mb AS MB INNER JOIN dbo.Cuentas AS C ON C.CtaSCta = MB.CtaSCta
`;

export const queryRodasUltimoPeriodoMB = `SELECT ISNULL(MAX(Periodo),0) as Periodo FROM ActFijos_MB WHERE IdCentro = @Centro`;
