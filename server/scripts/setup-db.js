// Alternativa a MySQL Workbench: ejecuta database/01_schema.sql y 02_seed.sql desde la terminal.
//   npm run db:setup
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { config } from '../config.js';

const carpeta = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database');

const conexion = await mysql.createConnection({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  charset: 'utf8mb4',
  multipleStatements: true,
});

for (const archivo of ['01_schema.sql', '02_seed.sql']) {
  await conexion.query(fs.readFileSync(path.join(carpeta, archivo), 'utf8'));
  console.log('✔', archivo);
}
await conexion.end();
console.log('Base de datos lista.');
