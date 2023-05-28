import { ESTADISTICA_QUERY } from './conta-estadistica.model';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { ContaEstadisticaInput } from './dto/conta-estadistica.input';
import { Injectable } from '@nestjs/common';
import { ContaEstadisticaParteView, ContaEstadisticaView } from './entities/conta-estadistica.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
          .then(async con => {
            await con.query(ESTADISTICA_QUERY.replace(/@annio/gi, annio.toString()).replace(/@periodo/gi, periodo.toString())).then(async res => {
              const result = res[0] || null;

              await contaEstadisticas.push({
                Annio: annio,
                Periodo: periodo,
                IdDivision: _conexionRodas.IdDivision,
                Division: _conexionRodas.Division.Division,
                IdCentro: _conexionRodas.IdUnidad,
                Centro: _conexionRodas.Unidad.Nombre,
                Consolidado: _conexionRodas.Consolidado,
                FechaActualizacion: _conexionRodas.FechaActualizacion,
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
      });
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }

  async findAllParte(): Promise<ContaEstadisticaParteView[]> {
    try {
      return new Promise<ContaEstadisticaParteView[]>((resolve, reject) => {
        this.dataSource.manager
          .find(ContaEstadisticaParteView)
          .then(res => {
            resolve(res);
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
