export const ESTADISTICA_QUERY = `SELECT anno, periodo, MIN(fecha_hora_actualizacion) as fecha_inicio, MAX(fecha_hora_actualizacion) as fecha_fin, COUNT(numero) as comprobantes, SUM(CASE WHEN estado = 'T' THEN 1 ELSE 0 END) as traspasados, SUM(CASE WHEN estado = 'N' THEN 1 ELSE 0 END) as sin_traspasar, SUM(CASE WHEN estado = 'I' THEN 1 ELSE 0 END) as inconclusos, SUM(CASE WHEN estado = 'A' THEN 1 ELSE 0 END) as anulados
  FROM contabilidad.comprobantes
  WHERE anno = @annio and periodo = @periodo
  GROUP BY anno, periodo
  ORDER BY anno, periodo`;
