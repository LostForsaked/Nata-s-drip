import { Router } from 'express';
import { pool, transaccion } from '../db.js';
import { HttpError, noEncontrado } from '../errores.js';
import { mapOrden } from '../mappers.js';
import { requiereRol, STAFF } from '../middleware/sesion.js';
import { validarEnvio } from '../../src/utils/validaciones.js';
import { itemsDeSesion, cuponDeSesion, calcularTotales } from './carrito.js';

const router = Router();

/* ------------------------------- lectura ------------------------------- */

async function cargarOrdenes(where = '', params = [], conexion = pool) {
  const [ordenes] = await conexion.query(`SELECT * FROM ordenes ${where} ORDER BY id`, params);
  if (!ordenes.length) return [];

  const [items] = await conexion.query(
    `SELECT oi.*, p.imagen
       FROM orden_items oi
       LEFT JOIN productos p ON p.id = oi.producto_id
      WHERE oi.orden_id IN (?)
      ORDER BY oi.id`,
    [ordenes.map((o) => o.id)]
  );
  return ordenes.map((o) =>
    mapOrden(o, items.filter((i) => i.orden_id === o.id))
  );
}

/**
 * Staff ve todo; un cliente ve las suyas; un invitado ve la que compró en esta sesión.
 * Con { soloComprador: true } (pagar / rechazar) el staff NO tiene acceso especial.
 */
async function ordenAccesible(req, id, { soloComprador = false } = {}, conexion = pool) {
  const [orden] = await cargarOrdenes('WHERE id = ?', [id], conexion);
  if (!orden) throw noEncontrado('Orden no encontrada.');

  const usuario = req.sesion.usuario;
  const [[fila]] = await conexion.query('SELECT sesion_id FROM ordenes WHERE id = ?', [id]);
  const permitido =
    (!soloComprador && usuario && STAFF.includes(usuario.rol)) ||
    (usuario && orden.usuarioId === usuario.id) ||
    fila.sesion_id === req.sesion.id;

  if (!permitido) throw noEncontrado('Orden no encontrada.'); // 404: no revela que existe
  return orden;
}

router.get('/ordenes', requiereRol(...STAFF), async (_req, res) => {
  res.json(await cargarOrdenes());
});

router.get('/ordenes/:id', async (req, res) => {
  res.json(await ordenAccesible(req, req.params.id));
});

/* ------------------------------- crear orden ------------------------------- */

/** Mismo mensaje que antes mostraba verificarStock() */
function mensajeStock(item, stockActual) {
  if (stockActual === undefined) return `El producto "${item.nombre}" ya no está disponible.`;
  if (stockActual < item.cantidad) {
    return `solo quedan ${stockActual} unidades de "${item.nombre}" (pediste ${item.cantidad}).`;
  }
  return null;
}

/**
 * Crea la orden "pendiente de pago" a partir del carrito y cupón que están
 * guardados en la sesión (los precios salen de MySQL, no del navegador).
 */
router.post('/ordenes', async (req, res) => {
  const cliente = req.body?.cliente ?? {};
  const direccion = req.body?.direccion ?? {};
  const t = (v) => String(v ?? '').trim();

  const errores = validarEnvio({
    nombre: t(cliente.nombre), apellidos: t(cliente.apellidos), correo: t(cliente.correo),
    calle: t(direccion.calle), departamento: t(direccion.departamento),
    region: t(direccion.region), comuna: t(direccion.comuna), indicaciones: t(direccion.indicaciones),
  });
  const primero = Object.entries(errores).find(([, msg]) => msg);
  if (primero) throw new HttpError(400, primero[1], primero[0]);

  const orden = await transaccion(async (conexion) => {
    const items = await itemsDeSesion(req.sesion.id, conexion);
    if (!items.length) throw new HttpError(400, 'Tu carrito está vacío.');

    for (const i of items) {
      const msg = mensajeStock({ nombre: i.nombre, cantidad: i.cantidad }, i.producto.stock);
      if (msg) throw new HttpError(409, msg);
    }

    const cupon = await cuponDeSesion(req.sesion.id, conexion);
    const totales = calcularTotales(items, cupon);

    const [r] = await conexion.query(
      `INSERT INTO ordenes
         (numero, usuario_id, sesion_id, estado,
          cliente_nombre, cliente_apellidos, cliente_correo,
          dir_calle, dir_departamento, dir_region, dir_comuna, dir_indicaciones,
          subtotal, descuento, total, cupon, fecha)
       VALUES (?, ?, ?, 'pendiente de pago', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [
        `TMP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, // se reemplaza abajo
        req.sesion.usuario?.id ?? null, req.sesion.id,
        t(cliente.nombre), t(cliente.apellidos), t(cliente.correo),
        t(direccion.calle), t(direccion.departamento), t(direccion.region), t(direccion.comuna), t(direccion.indicaciones),
        totales.subtotal, totales.descuento, totales.total, cupon?.codigo ?? null,
      ]
    );

    // Número legible: ND-AAAAMMDD-0001 (igual que antes)
    const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const numero = `ND-${ymd}-${String(r.insertId).padStart(4, '0')}`;
    await conexion.query('UPDATE ordenes SET numero = ? WHERE id = ?', [numero, r.insertId]);

    await conexion.query(
      'INSERT INTO orden_items (orden_id, producto_id, nombre, precio_unitario, cantidad, subtotal) VALUES ?',
      [items.map((i) => [r.insertId, i.id, i.nombre, i.precioUnitario, i.cantidad, i.subtotal])]
    );

    const [creada] = await cargarOrdenes('WHERE id = ?', [r.insertId], conexion);
    return creada;
  });

  res.status(201).json(orden);
});

/* ------------------------------- pago ------------------------------- */

/**
 * Pago aprobado: descuenta el stock, marca la orden como Pagada y vacía el
 * carrito. Todo en UNA transacción con las filas bloqueadas: si dos personas
 * compran la última unidad al mismo tiempo, solo una lo logra.
 */
router.post('/ordenes/:id/pagar', async (req, res) => {
  await ordenAccesible(req, req.params.id, { soloComprador: true }); // 404 si no es suya

  const orden = await transaccion(async (conexion) => {
    const [[actual]] = await conexion.query('SELECT estado FROM ordenes WHERE id = ? FOR UPDATE', [req.params.id]);
    if (actual.estado === 'Pagada') {
      const [ya] = await cargarOrdenes('WHERE id = ?', [req.params.id], conexion);
      return ya;
    }

    const [items] = await conexion.query(
      'SELECT producto_id, nombre, cantidad FROM orden_items WHERE orden_id = ? ORDER BY producto_id',
      [req.params.id]
    );

    // Bloquea los productos (en orden de id, para evitar bloqueos cruzados)
    const ids = items.map((i) => i.producto_id).filter((id) => id !== null);
    const [productos] = ids.length
      ? await conexion.query('SELECT id, stock FROM productos WHERE id IN (?) ORDER BY id FOR UPDATE', [ids])
      : [[]];
    const stockPorId = new Map(productos.map((p) => [p.id, p.stock]));

    for (const item of items) {
      const msg = mensajeStock(item, item.producto_id === null ? undefined : stockPorId.get(item.producto_id));
      if (msg) throw new HttpError(409, msg);
    }

    for (const item of items) {
      await conexion.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [item.cantidad, item.producto_id]);
    }
    await conexion.query(
      "UPDATE ordenes SET estado = 'Pagada', fecha_pago = UTC_TIMESTAMP() WHERE id = ?",
      [req.params.id]
    );
    // Compra completada: carrito y cupón de esta sesión quedan vacíos
    await conexion.query('DELETE FROM carrito_items WHERE sesion_id = ?', [req.sesion.id]);
    await conexion.query('UPDATE sesiones SET cupon_codigo = NULL WHERE id = ?', [req.sesion.id]);

    const [pagada] = await cargarOrdenes('WHERE id = ?', [req.params.id], conexion);
    return pagada;
  });

  res.json({ ok: true, orden });
});

/** Pago rechazado: la orden queda como "Pago fallido" y el carrito se conserva. */
router.post('/ordenes/:id/rechazar', async (req, res) => {
  await ordenAccesible(req, req.params.id, { soloComprador: true });
  await pool.query("UPDATE ordenes SET estado = 'Pago fallido' WHERE id = ? AND estado <> 'Pagada'", [req.params.id]);
  res.json({ ok: true, orden: await ordenAccesible(req, req.params.id) });
});

export default router;
