import { ActaConciliacion, ConciliaExternaContabilidadEntity } from './concilia-externa-contabilidad.model';
import { ConcExtContabilidad } from './entities/concilia-externa-contabilidad.entity';
import { MutationResponse } from '../shared/models/mutation.response.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConciliaExternaContabilidadInput } from './dto/concilia-externa-contabilidad.input';

@Injectable()
export class ConciliaExtContabilidadService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getConciliacion(conciliaExternaInput: ConciliaExternaContabilidadInput): Promise<ConciliaExternaContabilidadEntity> {
    try {
      const { Annio, Mes, Division, Unidad, DivisionOD, UnidadOD } = conciliaExternaInput;

      const getConciliaContab = this.conciliacionContab(Annio, Mes, Division, Unidad, DivisionOD, UnidadOD);
      const getActaConciliacion = this.actaConciliacion(Annio, Mes, Unidad, UnidadOD);

      return new Promise<ConciliaExternaContabilidadEntity>((resolve, reject) => {
        Promise.all([getConciliaContab, getActaConciliacion])
          .then(result => {
            const _data: ConciliaExternaContabilidadEntity = {
              getConciliaContab: result[0] as any,
              getActaConciliacion: result[1] as any,
            };
            resolve(_data);
          })
          .catch(err => {
            return reject(err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  async conciliacionContab(annio: number, mes: number, division: number, unidad: number, divisionOD: number, unidadOD: number): Promise<ConcExtContabilidad> {
    try {
      return new Promise<ConcExtContabilidad>((resolve, reject) => {
        const _query = `SELECT * FROM dbo.vConcExt_ConciliaContabilidad
          WHERE Annio = ${annio} AND Mes = ${mes}
          AND ((DivisionEmisor = CASE WHEN ${division} = 0 THEN DivisionEmisor ELSE ${division} END AND Emisor = CASE WHEN ${unidad} = 0 THEN Emisor ELSE ${unidad} END 
              AND DivisionReceptor = CASE WHEN ${divisionOD} = 0 THEN DivisionReceptor ELSE ${divisionOD} END AND Receptor = CASE WHEN ${unidadOD} = 0 THEN Receptor ELSE ${unidadOD} END)
          OR (DivisionEmisor = CASE WHEN ${divisionOD} = 0 THEN DivisionEmisor ELSE ${divisionOD} END AND Emisor = CASE WHEN ${unidadOD} = 0 THEN Emisor ELSE ${unidadOD} END
            AND DivisionReceptor = CASE WHEN ${division} = 0 THEN DivisionReceptor ELSE ${division} END AND Receptor = CASE WHEN ${unidad} = 0 THEN Receptor ELSE ${unidad} END))
          ORDER BY DivisionEmisor, Emisor, Documento, DivisionReceptor, Receptor`;

        this.dataSource
          .query(_query)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            return reject(err.message || err);
          });
      });
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }

  async updateConciliaContab(data: any[]): Promise<MutationResponse> {
    try {
      data.map(d => {
        const recibido: number = d.Recibido ? 1 : 0;

        this.dataSource
          .query(
            `update dbo.ConcExt_ConciliaContabilidad
                    set Recibido = ${recibido}
                    where Id = ${d.Id}`,
          )
          .catch(err => {
            return { success: false, error: err.message ? err.message : err };
          });
      });

      return new Promise<MutationResponse>(resolve => {
        resolve({ success: true });
      });
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async actaConciliacion(annio: number, mes: number, unidad: number, unidadOD: number): Promise<ActaConciliacion[]> {
    if (unidad === 0 || unidadOD === 0) {
      return [];
    }

    const stringQuery = `SELECT 1 AS ID, 'Saldo Inicial (Saldo período anterior)' AS Detalle, I.Emisor, I.Receptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0)), 2) AS SaldoEmisor, ROUND(SUM(ISNULL(I.SaldoReceptor, 0)), 2) AS SaldoReceptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0) - ISNULL(SaldoReceptor, 0)), 2) AS Diferencia FROM (
            SELECT ${unidad} AS Emisor, ${unidadOD} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT ${unidadOD} AS Emisor, ${unidad} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Débito - Crédito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (135) AND Período < ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Débito - Crédito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (135) AND Período < ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Crédito - Débito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (405) AND Período < ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Crédito - Débito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (405) AND Período < ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
        ) AS I
        GROUP BY I.Emisor, I.Receptor
        UNION ALL
        SELECT 2 AS ID, '(+) Total Facturas o Doc. de Cobro' AS Detalle, I.Emisor, I.Receptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0)), 2) AS SaldoEmisor, ROUND(SUM(ISNULL(I.SaldoReceptor, 0)), 2) AS SaldoReceptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0) - ISNULL(SaldoReceptor, 0)), 2) AS Diferencia FROM (
            SELECT ${unidad} AS Emisor, ${unidadOD} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT ${unidadOD} AS Emisor, ${unidad} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Débito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (135) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Débito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (135) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Crédito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (405) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Crédito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (405) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
        ) AS I
        GROUP BY I.Emisor, I.Receptor
        UNION ALL
        SELECT 3 AS ID, '(-) Pagos y/o Devoluciones' AS Detalle, I.Emisor, I.Receptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0)), 2) AS SaldoEmisor, ROUND(SUM(ISNULL(I.SaldoReceptor, 0)), 2) AS SaldoReceptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0) - ISNULL(SaldoReceptor, 0)), 2) AS Diferencia FROM (
            SELECT ${unidad} AS Emisor, ${unidadOD} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT ${unidadOD} AS Emisor, ${unidad} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Crédito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (135) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Crédito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (135) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Débito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (405) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Débito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (405) AND Período = ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
        ) AS I
        GROUP BY I.Emisor, I.Receptor
        UNION ALL
        SELECT 4 AS ID, 'Saldo Final (Saldo Balance cierre mes)' AS Detalle, I.Emisor, I.Receptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0)), 2) AS SaldoEmisor, ROUND(SUM(ISNULL(I.SaldoReceptor, 0)), 2) AS SaldoReceptor, ROUND(SUM(ISNULL(I.SaldoEmisor, 0) - ISNULL(SaldoReceptor, 0)), 2) AS Diferencia FROM (
            SELECT ${unidad} AS Emisor, ${unidadOD} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT ${unidadOD} AS Emisor, ${unidad} AS Receptor, 0 AS SaldoEmisor, 0 AS SaldoReceptor
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Débito - Crédito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (135) AND Período <= ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Receptor, ROUND(SUM(Débito - Crédito), 2) AS SaldoEmisor, 0 AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (135) AND Período <= ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Crédito - Débito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidadOD} AND Año = ${annio} AND Cuenta IN (405) AND Período <= ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidad}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
            UNION ALL
            SELECT CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END AS Emisor, CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END AS Receptor, 0 AS SaldoEmisor, ROUND(SUM(Crédito - Débito), 2) AS SaldoReceptor
            FROM dbo.Conta_Asiento
            WHERE Consolidado = 0 AND CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END = ${unidad} AND Año = ${annio} AND Cuenta IN (405) AND Período <= ${mes} AND CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END = ${unidadOD}
            GROUP BY CASE WHEN [Tipo de Análisis 1] = 'Y' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'Y' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'Y' THEN [Análisis 3] ELSE Centro END, CASE WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1] WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2] WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] END
        ) AS I
        GROUP BY I.Emisor, I.Receptor`;

    return new Promise<ActaConciliacion[]>((resolve, reject) => {
      this.dataSource
        .query(stringQuery)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async getCentrosConOperaciones(annio: number, mes: number) {
    const stringQuery = `SELECT CASE WHEN Cuenta IN (135) THEN Unidad
                WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1]
                WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2]
                WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] ELSE '' END AS Emisor,
                CASE WHEN Cuenta IN (405) THEN Unidad
                WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1]
                WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2]
                WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] ELSE '' END AS Receptor
            FROM dbo.Conta_Asiento
            WHERE Año Consolidado = 0 AND = ${annio} AND Período <= ${mes}
            GROUP BY CASE WHEN Cuenta IN (135) THEN Unidad
                    WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1]
                    WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2]
                    WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] ELSE '' END,
                CASE WHEN Cuenta IN (405) THEN Unidad
                    WHEN [Tipo de Análisis 1] = 'E' THEN [Análisis 1]
                    WHEN [Tipo de Análisis 2] = 'E' THEN [Análisis 2]
                    WHEN [Tipo de Análisis 3] = 'E' THEN [Análisis 3] ELSE '' END`;

    return new Promise<ActaConciliacion[]>((resolve, reject) => {
      this.dataSource
        .query(stringQuery)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

  async getDiferenciasEnConciliacion(annio: number, mes: number): Promise<ConcExtContabilidad[]> {
    try {
      return new Promise<ConcExtContabilidad[]>((resolve, reject) => {
        const stringQuery = `select * from vDiferenciasEnConciliacion
                        where Annio = ${annio} and Mes = ${mes}`;

        this.dataSource
          .query(stringQuery)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }
}
