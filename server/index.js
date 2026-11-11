import { config } from './config.js';
import { pool } from './db.js';
import { crearApp } from './app.js';
import { limpiarSesionesVencidas } from './middleware/sesion.js';

async function iniciar() {
  try {
    await pool.query('SELECT 1 FROM productos LIMIT 1');
  } catch (err) {
    console.error('\n✖ No se pudo usar la base de datos "%s" en %s:%s', config.db.database, config.db.host, config.db.port);
    if (err.code === 'ECONNREFUSED') console.error('  MySQL no está encendido (o el host/puerto del .env es incorrecto).');
    else if (err.code === 'ER_ACCESS_DENIED_ERROR') console.error('  Usuario o contraseña incorrectos: revisa DB_USER y DB_PASSWORD en el archivo .env');
    else if (err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE') console.error('  Falta crear la base: ejecuta database/01_schema.sql y database/02_seed.sql en MySQL Workbench.');
    else console.error(' ', err.message);
    process.exit(1);
  }

  await limpiarSesionesVencidas();
  setInterval(() => limpiarSesionesVencidas().catch(console.error), 60 * 60 * 1000).unref();

  crearApp().listen(config.port, () => {
    console.log(`✔ API de Nata's Drip lista en http://localhost:${config.port}  (base de datos: ${config.db.database})`);
  });
}

iniciar();
