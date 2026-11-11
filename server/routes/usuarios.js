import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, esDuplicado } from '../db.js';
import { HttpError, noEncontrado } from '../errores.js';
import { mapUsuario } from '../mappers.js';
import { requiereRol } from '../middleware/sesion.js';
import { validarCorreo, validarPassword, validarRun } from '../../src/utils/validaciones.js';

const router = Router();
const ROLES = ['Administrador', 'Vendedor', 'Cliente'];
const texto = (v) => String(v ?? '').trim();

/* ------------------------- Gestión de usuarios (solo Administrador) ------------------------- */

router.get('/usuarios', requiereRol('Administrador'), async (_req, res) => {
  const [filas] = await pool.query('SELECT * FROM usuarios ORDER BY id');
  res.json(filas.map(mapUsuario));
});

router.post('/usuarios', requiereRol('Administrador'), async (req, res) => {
  const d = req.body ?? {};

  if (!texto(d.nombre) || texto(d.nombre).length > 50) throw new HttpError(400, 'El nombre es obligatorio (máx. 50 caracteres).', 'nombre');
  if (texto(d.apellidos).length > 100) throw new HttpError(400, 'Los apellidos admiten máximo 100 caracteres.', 'apellidos');
  if (!validarCorreo(texto(d.correo))) throw new HttpError(400, 'Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com', 'correo');
  if (!validarPassword(String(d.password ?? ''))) throw new HttpError(400, 'La contraseña debe tener entre 4 y 10 caracteres.', 'password');
  if (!ROLES.includes(d.rol)) throw new HttpError(400, 'Rol inválido.', 'rol');
  if (texto(d.run) && !validarRun(texto(d.run))) throw new HttpError(400, 'RUN inválido.', 'run');

  const run = texto(d.run) ? texto(d.run).toUpperCase().replace(/[.-]/g, '') : null;
  const hash = await bcrypt.hash(String(d.password), 10);

  try {
    const [r] = await pool.query(
      `INSERT INTO usuarios
         (run, nombre, apellidos, correo, password_hash, telefono, fecha_nacimiento, rol, region, comuna, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        run, texto(d.nombre), texto(d.apellidos), texto(d.correo), hash,
        texto(d.telefono).slice(0, 20), texto(d.fechaNacimiento) || null, d.rol,
        texto(d.region), texto(d.comuna), texto(d.direccion).slice(0, 300),
      ]
    );
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [r.insertId]);
    res.status(201).json(mapUsuario(filas[0]));
  } catch (err) {
    if (esDuplicado(err, 'uq_usuarios_correo')) throw new HttpError(409, 'Este correo ya está registrado.', 'correo');
    if (esDuplicado(err, 'uq_usuarios_run')) throw new HttpError(409, 'Este RUN ya está registrado.', 'run');
    throw err;
  }
});

router.delete('/usuarios/:id', requiereRol('Administrador'), async (req, res) => {
  if (String(req.sesion.usuario.id) === String(req.params.id)) {
    throw new HttpError(400, 'No puedes eliminarte a ti mismo.');
  }
  const [r] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) throw noEncontrado('Usuario no encontrado.');
  res.status(204).end();
});

/* ------------------------- Mi perfil (cualquier usuario logueado) ------------------------- */

router.put('/perfil', requiereRol(), async (req, res) => {
  const d = req.body ?? {};
  if (!texto(d.nombre) || texto(d.nombre).length > 50) throw new HttpError(400, 'El nombre es obligatorio.', 'nombre');
  if (!texto(d.apellidos) || texto(d.apellidos).length > 100) throw new HttpError(400, 'Los apellidos son obligatorios.', 'apellidos');
  if (texto(d.telefono) && !/^\+?\d{8,12}$/.test(texto(d.telefono))) throw new HttpError(400, 'Teléfono inválido (8 a 12 dígitos).', 'telefono');
  if (!texto(d.region)) throw new HttpError(400, 'Selecciona una región.', 'region');
  if (!texto(d.comuna)) throw new HttpError(400, 'Selecciona una comuna.', 'comuna');
  if (!texto(d.direccion) || texto(d.direccion).length > 300) throw new HttpError(400, 'La dirección es obligatoria.', 'direccion');

  await pool.query(
    `UPDATE usuarios
        SET nombre = ?, apellidos = ?, telefono = ?, region = ?, comuna = ?, direccion = ?
      WHERE id = ?`,
    [texto(d.nombre), texto(d.apellidos), texto(d.telefono), texto(d.region), texto(d.comuna), texto(d.direccion), req.sesion.usuario.id]
  );
  const [filas] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.sesion.usuario.id]);
  res.json({ usuario: mapUsuario(filas[0]) });
});

router.put('/perfil/password', requiereRol(), async (req, res) => {
  const actual = String(req.body?.actual ?? '');
  const nueva = String(req.body?.nueva ?? '');

  const [filas] = await pool.query('SELECT password_hash FROM usuarios WHERE id = ?', [req.sesion.usuario.id]);
  if (!(await bcrypt.compare(actual, filas[0].password_hash))) {
    throw new HttpError(400, 'La contraseña actual no coincide.', 'actual');
  }
  if (!validarPassword(nueva)) throw new HttpError(400, 'Debe tener entre 4 y 10 caracteres.', 'nueva');

  await pool.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', [
    await bcrypt.hash(nueva, 10),
    req.sesion.usuario.id,
  ]);
  res.json({ ok: true });
});

export default router;
