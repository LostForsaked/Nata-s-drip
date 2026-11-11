import { Router } from 'express';
import { pool, esDuplicado } from '../db.js';
import { HttpError, noEncontrado } from '../errores.js';
import { mapCategoria } from '../mappers.js';
import { requiereRol } from '../middleware/sesion.js';

const router = Router();

function validarNombre(valor) {
  const nombre = String(valor ?? '').trim();
  if (!nombre) throw new HttpError(400, 'El nombre es obligatorio.', 'nombre');
  if (nombre.length > 50) throw new HttpError(400, 'Máximo 50 caracteres.', 'nombre');
  return nombre;
}

router.get('/categorias', async (_req, res) => {
  const [filas] = await pool.query('SELECT id, nombre FROM categorias ORDER BY id');
  res.json(filas.map(mapCategoria));
});

router.post('/categorias', requiereRol('Administrador'), async (req, res) => {
  const nombre = validarNombre(req.body?.nombre);
  try {
    const [r] = await pool.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id: r.insertId, nombre });
  } catch (err) {
    if (esDuplicado(err)) throw new HttpError(409, 'Ya existe una categoría con ese nombre.', 'nombre');
    throw err;
  }
});

router.put('/categorias/:id', requiereRol('Administrador'), async (req, res) => {
  const nombre = validarNombre(req.body?.nombre);
  try {
    const [r] = await pool.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, req.params.id]);
    if (!r.affectedRows) throw noEncontrado('La categoría no existe.');
    res.json({ id: Number(req.params.id), nombre });
  } catch (err) {
    if (esDuplicado(err)) throw new HttpError(409, 'Ya existe una categoría con ese nombre.', 'nombre');
    throw err;
  }
});

router.delete('/categorias/:id', requiereRol('Administrador'), async (req, res) => {
  const [[{ cantidad }]] = await pool.query(
    'SELECT COUNT(*) AS cantidad FROM productos WHERE categoria_id = ?',
    [req.params.id]
  );
  if (cantidad > 0) throw new HttpError(409, 'No puedes eliminar una categoría que tiene productos.');
  const [r] = await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) throw noEncontrado('La categoría no existe.');
  res.status(204).end();
});

export default router;
