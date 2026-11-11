import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cargarSesion } from './middleware/sesion.js';
import { HttpError } from './errores.js';
import authRutas from './routes/auth.js';
import categoriasRutas from './routes/categorias.js';
import productosRutas from './routes/productos.js';
import usuariosRutas from './routes/usuarios.js';
import carritoRutas from './routes/carrito.js';
import ordenesRutas from './routes/ordenes.js';

const carpetaDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

export function crearApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');

  // 2 MB: las imágenes subidas desde el admin viajan como data-URL (máx. ~300 KB)
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  const api = express.Router();
  api.use(cargarSesion);
  api.use(authRutas);
  api.use(categoriasRutas);
  api.use(productosRutas);
  api.use(usuariosRutas);
  api.use(carritoRutas);
  api.use(ordenesRutas);
  api.use((_req, _res, next) => next(new HttpError(404, 'Ruta no encontrada.')));
  app.use('/api', api);

  // En producción (npm run build) Express también sirve la web
  if (fs.existsSync(carpetaDist)) {
    app.use(express.static(carpetaDist));
    app.get('/{*ruta}', (_req, res) => res.sendFile(path.join(carpetaDist, 'index.html')));
  }

  // Manejo central de errores
  app.use((err, _req, res, _next) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message, campo: err.campo });
    }
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido.' });
    if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'La solicitud es demasiado grande.' });
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  });

  return app;
}
