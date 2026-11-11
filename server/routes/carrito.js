import { Router } from 'express';
import { pool } from '../db.js';
import { HttpError } from '../errores.js';
import { mapProducto, precioFinal } from '../mappers.js';

const router = Router();

/** Cupón vigente de la sesión: { codigo, porcentaje } o null. */
export async function cuponDeSesion(sesionId, conexion = pool) {
  const [filas] = await conexion.query(
    `SELECT cu.codigo, cu.porcentaje
       FROM sesiones s
       JOIN cupones cu ON cu.codigo = s.cupon_codigo AND cu.activo = 1
      WHERE s.id = ?`,
    [sesionId]
  );
  return filas[0] ? { codigo: filas[0].codigo, porcentaje: filas[0].porcentaje } : null;
}

/** Items del carrito de la sesión, con su producto y precios calculados. */
export async function itemsDeSesion(sesionId, conexion = pool) {
  const [filas] = await conexion.query(
    `SELECT ci.cantidad, p.*, c.nombre AS categoria_nombre
       FROM carrito_items ci
       JOIN productos p ON p.id = ci.producto_id
       JOIN categorias c ON c.id = p.categoria_id
      WHERE ci.sesion_id = ?
      ORDER BY ci.creado_en, ci.producto_id`,
    [sesionId]
  );
  return filas.map((f) => {
    const producto = mapProducto(f);
    const precioUnitario = precioFinal(producto.precio, producto.descuento);
    return {
      id: producto.id,
      producto,
      nombre: producto.nombre,
      imagen: producto.imagen,
      cantidad: f.cantidad,
      precioUnitario,
      subtotal: precioUnitario * f.cantidad,
    };
  });
}

export function calcularTotales(items, cupon) {
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const descuento = cupon ? Math.round((subtotal * cupon.porcentaje) / 100) : 0;
  return { subtotal, descuento, total: subtotal - descuento };
}

async function carritoCompleto(sesionId) {
  return { items: await itemsDeSesion(sesionId), cupon: await cuponDeSesion(sesionId) };
}

router.get('/carrito', async (req, res) => {
  res.json(await carritoCompleto(req.sesion.id));
});

/** Agrega unidades (sin superar el stock). Responde igual que antes: { ok, limitadoPorStock | motivo }. */
router.post('/carrito/items', async (req, res) => {
  const productoId = Number(req.body?.productoId);
  const cantidad = req.body?.cantidad === undefined ? 1 : Number(req.body.cantidad);
  if (!Number.isInteger(productoId) || !Number.isInteger(cantidad) || cantidad < 1) {
    throw new HttpError(400, 'Datos de producto inválidos.');
  }

  const [prods] = await pool.query('SELECT id, stock FROM productos WHERE id = ?', [productoId]);
  const producto = prods[0];
  if (!producto || producto.stock <= 0) return res.json({ ok: false, motivo: 'sin-stock' });

  const [existente] = await pool.query(
    'SELECT cantidad FROM carrito_items WHERE sesion_id = ? AND producto_id = ?',
    [req.sesion.id, productoId]
  );
  const deseada = (existente[0]?.cantidad ?? 0) + cantidad;
  const nueva = Math.min(deseada, producto.stock);

  await pool.query(
    `INSERT INTO carrito_items (sesion_id, producto_id, cantidad) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE cantidad = ?`,
    [req.sesion.id, productoId, nueva, nueva]
  );
  res.json({ ok: true, limitadoPorStock: deseada > nueva });
});

/** Suma o resta unidades (delta = +1 / -1). Si llega a 0 se quita del carrito. */
router.patch('/carrito/items/:productoId', async (req, res) => {
  const delta = Number(req.body?.delta);
  if (!Number.isInteger(delta)) throw new HttpError(400, 'Cambio de cantidad inválido.');

  const [filas] = await pool.query(
    `SELECT ci.cantidad, p.stock
       FROM carrito_items ci JOIN productos p ON p.id = ci.producto_id
      WHERE ci.sesion_id = ? AND ci.producto_id = ?`,
    [req.sesion.id, req.params.productoId]
  );
  if (filas[0]) {
    const nueva = Math.min(filas[0].cantidad + delta, filas[0].stock);
    if (nueva > 0) {
      await pool.query(
        'UPDATE carrito_items SET cantidad = ? WHERE sesion_id = ? AND producto_id = ?',
        [nueva, req.sesion.id, req.params.productoId]
      );
    } else {
      await pool.query('DELETE FROM carrito_items WHERE sesion_id = ? AND producto_id = ?', [
        req.sesion.id, req.params.productoId,
      ]);
    }
  }
  res.json(await carritoCompleto(req.sesion.id));
});

router.delete('/carrito/items/:productoId', async (req, res) => {
  await pool.query('DELETE FROM carrito_items WHERE sesion_id = ? AND producto_id = ?', [
    req.sesion.id, req.params.productoId,
  ]);
  res.json(await carritoCompleto(req.sesion.id));
});

/** Vacía el carrito y también quita el cupón (como hacía vaciarCarritoGlobal). */
router.delete('/carrito', async (req, res) => {
  await pool.query('DELETE FROM carrito_items WHERE sesion_id = ?', [req.sesion.id]);
  await pool.query('UPDATE sesiones SET cupon_codigo = NULL WHERE id = ?', [req.sesion.id]);
  res.json(await carritoCompleto(req.sesion.id));
});

router.put('/carrito/cupon', async (req, res) => {
  const codigo = String(req.body?.codigo ?? '').trim().toUpperCase();
  const [filas] = await pool.query('SELECT codigo, porcentaje FROM cupones WHERE codigo = ? AND activo = 1', [codigo]);
  if (!filas[0]) {
    await pool.query('UPDATE sesiones SET cupon_codigo = NULL WHERE id = ?', [req.sesion.id]);
    throw new HttpError(400, 'Cupón inválido.', 'cupon');
  }
  await pool.query('UPDATE sesiones SET cupon_codigo = ? WHERE id = ?', [filas[0].codigo, req.sesion.id]);
  res.json({ cupon: { codigo: filas[0].codigo, porcentaje: filas[0].porcentaje } });
});

router.delete('/carrito/cupon', async (req, res) => {
  await pool.query('UPDATE sesiones SET cupon_codigo = NULL WHERE id = ?', [req.sesion.id]);
  res.json({ cupon: null });
});

export default router;
