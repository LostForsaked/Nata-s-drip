// Recrea la base natas_drip_test (esquema + datos iniciales) antes de correr las pruebas de la API.
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const carpeta = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database');
const BD = 'natas_drip_test';

export default async function () {
  const conexion = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? '',
    charset: 'utf8mb4',
    multipleStatements: true,
  });
  await conexion.query(`DROP DATABASE IF EXISTS ${BD}`);
  for (const archivo of ['01_schema.sql', '02_seed.sql']) {
    const sql = fs.readFileSync(path.join(carpeta, archivo), 'utf8').replace(/\bnatas_drip\b/g, BD);
    await conexion.query(sql);
  }
  await conexion.end();
}
