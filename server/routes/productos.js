import { Router } from 'express';
import { pool, esDuplicado } from '../db.js';
import { HttpError, noEncontrado } from '../errores.js';
import { mapProducto } from '../mappers.js';
import { requiereRol, STAFF } from '../middleware/sesion.js';
import { validarProducto } from '../../src/utils/validaciones.js';

const router = Router();
const IMAGEN_POR_DEFECTO = '/img/Logo.jpg';

const SELECT_PRODUCTO = `
  SELECT p.*, c.nombre AS categoria_nombre
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id`;

export async function buscarProducto(id, conexion = pool) {
  const [filas] = await conexion.query(`${SELECT_PRODUCTO} WHERE p.id = ?`, [id]);
  return filas[0] ? mapProducto(filas[0]) : null;
}

/** Valida y deja el body listo para guardar en la tabla `productos`. */
function prepararDatos(datos) {
  const errores = validarProducto(datos);
  const primero = Object.entries(errores)[0];
  if (primero) throw new HttpError(400, primero[1], primero[0]);

  const critico = String(datos.stockCritico ?? '').trim();
  return {
    codigo: String(datos.codigo).trim(),
    nombre: String(datos.nombre).trim(),
    descripcion: String(datos.descripcion ?? '').trim(),
    imagen: datos.imagen || IMAGEN_POR_DEFECTO,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    stock_critico: critico === '' ? null : Number(critico),
    descuento: String(datos.descuento ?? '').trim() === '' ? 0 : Number(datos.descuento),
    categoria_id: Number(datos.categoriaId),
  };
}

function manejarErroresGuardado(err) {
  if (esDuplicado(err, 'uq_productos_codigo')) throw new HttpError(409, 'Ya existe un producto con ese código.', 'codigo');
  if (err?.code === 'ER_NO_REFERENCED_ROW_2') throw new HttpError(400, 'La categoría seleccionada no existe.', 'categoriaId');
  throw err;
}

router.get('/productos', async (_req, res) => {
  const [filas] = await pool.query(`${SELECT_PRODUCTO} ORDER BY p.id`);
  res.json(filas.map(mapProducto));
});

// Va ANTES de "/productos/:id" para que "criticos" no se tome como un id
router.get('/productos/criticos', requiereRol(...STAFF), async (_req, res) => {
  const [filas] = await pool.query(
    `${SELECT_PRODUCTO}
      WHERE p.stock_critico IS NOT NULL AND p.stock <= p.stock_critico
      ORDER BY p.stock, p.id`
  );
  res.json(filas.map(mapProducto));
});

router.get('/productos/:id', async (req, res) => {
  const producto = await buscarProducto(req.params.id);
  if (!producto) throw noEncontrado('Producto no encontrado.');
  res.json(producto);
});

router.post('/productos', requiereRol('Administrador'), async (req, res) => {
  const d = prepararDatos(req.body ?? {});
  try {
    const [r] = await pool.query(
      `INSERT INTO productos
         (codigo, nombre, descripcion, imagen, precio, stock, stock_critico, descuento, categoria_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.codigo, d.nombre, d.descripcion, d.imagen, d.precio, d.stock, d.stock_critico, d.descuento, d.categoria_id]
    );
    res.status(201).json(await buscarProducto(r.insertId));
  } catch (err) {
    manejarErroresGuardado(err);
  }
});

router.put('/productos/:id', requiereRol('Administrador'), async (req, res) => {
  const actual = await buscarProducto(req.params.id);
  if (!actual) throw noEncontrado('Producto no encontrado.');

  // Igual que antes: lo que no se envía se conserva
  const d = prepararDatos({ ...actual, ...req.body });
  try {
    await pool.query(
      `UPDATE productos
          SET codigo = ?, nombre = ?, descripcion = ?, imagen = ?, precio = ?,
              stock = ?, stock_critico = ?, descuento = ?, categoria_id = ?
        WHERE id = ?`,
      [d.codigo, d.nombre, d.descripcion, d.imagen, d.precio, d.stock, d.stock_critico, d.descuento, d.categoria_id, req.params.id]
    );
    res.json(await buscarProducto(req.params.id));
  } catch (err) {
    manejarErroresGuardado(err);
  }
});

router.delete('/productos/:id', requiereRol('Administrador'), async (req, res) => {
  const [r] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) throw noEncontrado('Producto no encontrado.');
  res.status(204).end();
});

export default router;
