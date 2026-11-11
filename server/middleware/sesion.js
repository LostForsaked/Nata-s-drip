import crypto from 'node:crypto';
import { pool } from '../db.js';
import { config } from '../config.js';
import { mapUsuario } from '../mappers.js';
import { HttpError } from '../errores.js';

const COOKIE = 'nd_sid';
const sha256 = (texto) => crypto.createHash('sha256').update(texto).digest('hex');

function ponerCookie(res, token) {
  // Si en esta misma respuesta ya se había puesto la cookie, se reemplaza (un solo Set-Cookie)
  const otras = [].concat(res.getHeader('Set-Cookie') ?? []).filter((c) => !String(c).startsWith(`${COOKIE}=`));
  if (otras.length) res.setHeader('Set-Cookie', otras);
  else res.removeHeader('Set-Cookie');

  res.cookie(COOKIE, token, {
    httpOnly: true, // el JavaScript del navegador no puede leerla
    sameSite: 'lax',
    secure: config.cookieSecure,
    maxAge: config.sesionDias * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

/**
 * Cada visitante tiene una fila en `sesiones` (identificada por una cookie httpOnly).
 * Ahí viven su usuario logueado, su cupón y (en carrito_items) su carrito:
 * lo que antes guardaba localStorage.
 * Deja en req.sesion = { id, usuario | null }.
 */
export async function cargarSesion(req, res, next) {
  const token = req.cookies?.[COOKIE];

  if (typeof token === 'string' && /^[a-f0-9]{64}$/.test(token)) {
    const [filas] = await pool.query(
      `SELECT s.id AS sesion_id, s.ultimo_acceso,
              u.id, u.run, u.nombre, u.apellidos, u.correo, u.telefono,
              u.fecha_nacimiento, u.rol, u.region, u.comuna, u.direccion
         FROM sesiones s
         LEFT JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ? AND s.expira_en > UTC_TIMESTAMP()`,
      [sha256(token)]
    );
    const fila = filas[0];
    if (fila) {
      // Renueva la expiración como máximo cada 10 minutos
      if (Date.now() - new Date(fila.ultimo_acceso).getTime() > 10 * 60 * 1000) {
        await pool.query(
          `UPDATE sesiones
              SET ultimo_acceso = UTC_TIMESTAMP(),
                  expira_en = DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? DAY)
            WHERE id = ?`,
          [config.sesionDias, fila.sesion_id]
        );
      }
      req.sesion = { id: fila.sesion_id, usuario: fila.id ? mapUsuario(fila) : null };
      return next();
    }
  }

  // Visitante nuevo (o cookie vencida): se crea una sesión anónima
  const nuevo = crypto.randomBytes(32).toString('hex');
  const [r] = await pool.query(
    `INSERT INTO sesiones (token_hash, expira_en)
     VALUES (?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? DAY))`,
    [sha256(nuevo), config.sesionDias]
  );
  ponerCookie(res, nuevo);
  req.sesion = { id: r.insertId, usuario: null };
  next();
}

/** Cambia el token de la cookie (al iniciar o cerrar sesión) conservando el carrito. */
export async function rotarToken(sesionId, res) {
  const nuevo = crypto.randomBytes(32).toString('hex');
  await pool.query('UPDATE sesiones SET token_hash = ? WHERE id = ?', [sha256(nuevo), sesionId]);
  ponerCookie(res, nuevo);
}

export const STAFF = ['Administrador', 'Vendedor'];

/** Exige sesión iniciada y (opcional) uno de los roles indicados. */
export function requiereRol(...roles) {
  return (req, _res, next) => {
    const usuario = req.sesion?.usuario;
    if (!usuario) return next(new HttpError(401, 'Debes iniciar sesión.'));
    if (roles.length && !roles.includes(usuario.rol)) {
      return next(new HttpError(403, 'No tienes permisos para esta acción.'));
    }
    next();
  };
}

export async function limpiarSesionesVencidas() {
  const [r] = await pool.query('DELETE FROM sesiones WHERE expira_en < UTC_TIMESTAMP()');
  return r.affectedRows;
}
