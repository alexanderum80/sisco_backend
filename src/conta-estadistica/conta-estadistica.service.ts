import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { ContaEstadisticaInput } from './dto/conta-estadistica.input';
import { Injectable } from '@nestjs/common';
import { ContaEstadisticaView } from './entities/conta-estadistica.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const ESTADISTICA_QUERY = `SELECT anno, periodo, MIN(fecha_hora_actualizacion) as fecha_inicio, MAX(fecha_hora_actualizacion) as fecha_fin, COUNT(numero) as comprobantes, SUM(CASE WHEN estado = 'T' THEN 1 ELSE 0 END) as traspasados, SUM(CASE WHEN estado = 'N' THEN 1 ELSE 0 END) as sin_traspasar, SUM(CASE WHEN estado = 'I' THEN 1 ELSE 0 END) as inconclusos, SUM(CASE WHEN estado = 'A' THEN 1 ELSE 0 END) as anulados
  FROM contabilidad.comprobantes
  WHERE anno = @annio and periodo = @periodo
  GROUP BY anno, periodo
  ORDER BY anno, periodo`;

@Injectable()
export class ContaEstadisticaService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource, private readonly contaConexionesSvc: ContaConexionesService) {}

  async findAll(contaEstadisticaInput: ContaEstadisticaInput): Promise<ContaEstadisticaView[]> {
    try {
      const { idDivision, annio, periodo } = contaEstadisticaInput;

      const _conexionesRodas = await this.contaConexionesSvc.findByIdDivision(idDivision).catch(err => {
        throw new Error(err);
      });

      const contaEstadisticas: ContaEstadisticaView[] = [];

      for (let index = 0; index < _conexionesRodas.length; index++) {
        const _conexionRodas = _conexionesRodas[index];
        // _conexionRodas.BaseDatos = `r4_${_conexionRodas.BaseDatos.toLowerCase()}`;

        await this.contaConexionesSvc
          .conexionRodas(_conexionRodas)
          .then(con => {
            con.query(ESTADISTICA_QUERY.replace(/@annio/gi, annio.toString()).replace(/@periodo/gi, periodo.toString())).then(res => {
              const result = res[0] || null;

              contaEstadisticas.push({
                Annio: annio,
                Periodo: periodo,
                IdDivision: _conexionRodas.IdDivision,
                Division: _conexionRodas.Division.Division,
                IdCentro: _conexionRodas.IdUnidad,
                Centro: _conexionRodas.Unidad.Nombre,
                Consolidado: _conexionRodas.Consolidado,
                FechaInicio: result?.fecha_inicio || null,
                FechaFin: result?.fecha_fin || null,
                Comprobantes: result?.comprobantes || 0,
                Traspasados: result?.traspasados || 0,
                SinTraspasar: result?.sin_traspasar || 0,
                Inconclusos: result?.inconclusos || 0,
                Anulados: result?.anulados || 0,
              });
              con.destroy();
            });
          })
          .catch(() => {
            throw new Error(
              `No se pudo establecer la conexión al Centro ${_conexionRodas.IdUnidad}.<br>Contacte con el personal de informática para que revise la configuración de la Conexión al Rodas.`,
            );
          });
      }

      return new Promise<ContaEstadisticaView[]>(resolve => {
        resolve(contaEstadisticas);
        // this.dataSource.manager
        //   .query('EXEC pConta_Estadistica @0, @1, @2', [idDivision, annio, periodo])
        //   .then(res => {
        //   })
        //   .catch(err => {
        //     reject(err);
        //   });
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }
}
