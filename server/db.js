import mysql from 'mysql2/promise';
import { config } from './config.js';

/**
 * Pool de conexiones a MySQL.
 *  - timezone 'Z' + time_zone '+00:00': todas las fechas se guardan en UTC.
 *  - decimalNumbers: los DECIMAL llegan como number (no como string).
 */
export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  timezone: 'Z',
  decimalNumbers: true,
});

pool.pool.on('connection', (conexion) => {
  conexion.query("SET time_zone = '+00:00'");
});

/** Ejecuta `fn(conexion)` dentro de una transacción (commit o rollback automático). */
export async function transaccion(fn) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const resultado = await fn(conexion);
    await conexion.commit();
    return resultado;
  } catch (err) {
    await conexion.rollback();
    throw err;
  } finally {
    conexion.release();
  }
}

/** true si el error es de clave duplicada en el índice UNIQUE indicado. */
export function esDuplicado(err, indice) {
  return err?.code === 'ER_DUP_ENTRY' && (!indice || String(err.message).includes(indice));
}
