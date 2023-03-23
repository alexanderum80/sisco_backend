import { UsuarioInfo } from './../usuarios/usuarios.model';
import { ContaConexionesService } from './../conta-conexiones/conta-conexiones.service';
import { ContaEstadisticaInput } from './dto/conta-estadistica.input';
import { Injectable } from '@nestjs/common';
import { ContaEstadisticaView, ContaEstadisticaEntity } from './entities/conta-estadistica.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment from 'moment-timezone';
import { Cron } from '@nestjs/schedule/dist';
import { CronExpression } from '@nestjs/schedule/dist/enums';

const ESTADISTICA_QUERY = `SELECT anno, periodo, MIN(fecha_hora_actualizacion) as fecha_inicio, MAX(fecha_hora_actualizacion) as fecha_fin, COUNT(numero) as comprobantes, SUM(CASE WHEN estado = 'T' THEN 1 ELSE 0 END) as traspasados, SUM(CASE WHEN estado = 'N' THEN 1 ELSE 0 END) as sin_traspasar, SUM(CASE WHEN estado = 'I' THEN 1 ELSE 0 END) as inconclusos, SUM(CASE WHEN estado = 'A' THEN 1 ELSE 0 END) as anulados
  FROM contabilidad.comprobantes
  WHERE anno = @annio and periodo = @periodo
  GROUP BY anno, periodo
  ORDER BY anno, periodo`;

@Injectable()
export class ContaEstadisticaService {
  constructor(
    @InjectRepository(ContaEstadisticaEntity) private readonly contaEstadisticaRepository: Repository<ContaEstadisticaEntity>,
    private readonly contaConexionesSvc: ContaConexionesService,
  ) {}

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async insertInformeEstadisticoDiario() {
    try {
      const _fecha = moment().get('date') <= 5 ? moment().add(-1, 'month') : moment();
      const annio = _fecha.year();
      const periodo = _fecha.month() + 1;

      const _conexionesRodas = await this.contaConexionesSvc.findAll(UsuarioInfo).catch(err => {
        throw new Error(err);
      });

      let contaEstadistica: ContaEstadisticaEntity;

      await this.contaEstadisticaRepository.clear().catch(err => {
        console.log(err);
      });

      for (let index = 0; index < _conexionesRodas.data.length; index++) {
        const _conexionRodas = _conexionesRodas.data[index];
        // _conexionRodas.BaseDatos = `r4_${_conexionRodas.BaseDatos.toLowerCase()}`;

        await this.contaConexionesSvc
          .conexionRodas(_conexionRodas)
          .then(async con => {
            await con.query(ESTADISTICA_QUERY.replace(/@annio/gi, annio.toString()).replace(/@periodo/gi, periodo.toString())).then(async res => {
              const result = res[0] || null;

              contaEstadistica = {
                Annio: annio,
                Periodo: periodo,
                Division: _conexionRodas.Division.IdDivision + '-' + _conexionRodas.Division.Division,
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
                Conexion: 1,
              };
              await this.contaEstadisticaRepository.save(contaEstadistica);

              con.destroy();
            });
          })
          .catch(async () => {
            contaEstadistica = {
              Annio: annio,
              Periodo: periodo,
              Division: _conexionRodas.Division.IdDivision + '-' + _conexionRodas.Division.Division,
              Centro: _conexionRodas.Unidad.Nombre,
              Consolidado: _conexionRodas.Consolidado,
              FechaActualizacion: _conexionRodas.FechaActualizacion,
              FechaInicio: null,
              FechaFin: null,
              Comprobantes: 0,
              Traspasados: 0,
              SinTraspasar: 0,
              Inconclusos: 0,
              Anulados: 0,
              Conexion: 0,
            };
            await this.contaEstadisticaRepository.save(contaEstadistica);
          });
      }
    } catch (err) {
      return Promise.reject(err.message || err);
    }
  }
}
