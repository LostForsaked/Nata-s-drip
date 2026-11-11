import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, esDuplicado } from '../db.js';
import { HttpError } from '../errores.js';
import { mapUsuario } from '../mappers.js';
import { rotarToken } from '../middleware/sesion.js';
import {
  validarRun, validarCorreo, validarPassword,
} from '../../src/utils/validaciones.js';

const router = Router();

// Hash falso: se compara igual aunque el correo no exista (evita medir tiempos de respuesta).
const HASH_FALSO = bcrypt.hashSync('no-existe', 10);

// Límite de intentos FALLIDOS de login: 10 cada 15 minutos por IP (un login correcto lo reinicia).
const fallidos = new Map();
const VENTANA_MS = 15 * 60 * 1000;
const recientes = (ip) => (fallidos.get(ip) || []).filter((t) => Date.now() - t < VENTANA_MS);

function limitarLogin(req, _res, next) {
  if (recientes(req.ip).length >= 10) {
    return next(new HttpError(429, 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'));
  }
  next();
}

/** Estado actual: ¿hay un usuario logueado en esta sesión? */
router.get('/sesion', (req, res) => {
  res.json({ usuario: req.sesion.usuario });
});

router.post('/auth/login', limitarLogin, async (req, res) => {
  const correo = String(req.body?.correo ?? '').trim();
  const password = String(req.body?.password ?? '');

  const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
  const usuario = filas[0];
  const ok = await bcrypt.compare(password, usuario ? usuario.password_hash : HASH_FALSO);
  if (!usuario || !ok) {
    fallidos.set(req.ip, [...recientes(req.ip), Date.now()]);
    throw new HttpError(401, 'Correo o contraseña incorrectos.', 'password');
  }
  fallidos.delete(req.ip);

  await pool.query('UPDATE sesiones SET usuario_id = ? WHERE id = ?', [usuario.id, req.sesion.id]);
  await rotarToken(req.sesion.id, res); // token nuevo: el carrito se conserva
  res.json({ usuario: mapUsuario(usuario) });
});

router.post('/auth/logout', async (req, res) => {
  await pool.query('UPDATE sesiones SET usuario_id = NULL WHERE id = ?', [req.sesion.id]);
  await rotarToken(req.sesion.id, res);
  res.json({ ok: true });
});

/** Registro público: SIEMPRE crea un Cliente (el rol no se puede elegir desde aquí). */
router.post('/auth/registro', async (req, res) => {
  const d = req.body ?? {};
  const texto = (v) => String(v ?? '').trim();

  if (!validarRun(texto(d.run))) throw new HttpError(400, 'RUN inválido. Ej: 19011022K', 'run');
  if (!texto(d.nombre) || texto(d.nombre).length > 50) throw new HttpError(400, 'El nombre es obligatorio (máx. 50 caracteres).', 'nombre');
  if (!texto(d.apellidos) || texto(d.apellidos).length > 100) throw new HttpError(400, 'Los apellidos son obligatorios (máx. 100 caracteres).', 'apellidos');
  if (!validarCorreo(texto(d.correo))) throw new HttpError(400, 'Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com', 'correo');
  if (!validarPassword(String(d.password ?? ''))) throw new HttpError(400, 'La contraseña debe tener entre 4 y 10 caracteres.', 'password');
  if (!texto(d.direccion) || texto(d.direccion).length > 300) throw new HttpError(400, 'La dirección es obligatoria (máx. 300 caracteres).', 'direccion');
  if (!texto(d.region) || !texto(d.comuna)) throw new HttpError(400, 'Debes seleccionar región y comuna.', 'region');

  const run = texto(d.run).toUpperCase().replace(/[.-]/g, '');
  const hash = await bcrypt.hash(String(d.password), 10);

  try {
    const [r] = await pool.query(
      `INSERT INTO usuarios
         (run, nombre, apellidos, correo, password_hash, telefono, fecha_nacimiento, rol, region, comuna, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Cliente', ?, ?, ?)`,
      [
        run, texto(d.nombre), texto(d.apellidos), texto(d.correo), hash,
        texto(d.telefono).slice(0, 20), texto(d.fechaNacimiento) || null,
        texto(d.region), texto(d.comuna), texto(d.direccion),
      ]
    );
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [r.insertId]);
    res.status(201).json({ usuario: mapUsuario(filas[0]) });
  } catch (err) {
    if (esDuplicado(err, 'uq_usuarios_correo')) throw new HttpError(409, 'Este correo ya está registrado.', 'correo');
    if (esDuplicado(err, 'uq_usuarios_run')) throw new HttpError(409, 'Este RUN ya está registrado.', 'run');
    throw err;
  }
});

export default router;
