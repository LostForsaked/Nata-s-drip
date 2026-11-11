/**
 * Carrito de compras.
 * ANTES: arreglo en localStorage ("mi_carrito") y cupón en "50off".
 * AHORA: se guarda en MySQL (tablas carrito_items y sesiones), asociado a la
 * cookie de sesión del visitante, así que sobrevive aunque cambie de navegador
 * al iniciar sesión y no se puede manipular desde la consola del navegador.
 */
import { api } from '../data/api';

/** Solo como pista en el formulario de cupón (el cupón real vive en la tabla `cupones`). */
export const CUPON_EJEMPLO = 'NATAS10';

/** { items, cupon } — items con producto, cantidad, precioUnitario y subtotal ya calculados. */
export const obtenerCarrito = () => api('/carrito');

export async function detalleCarrito() {
  return (await obtenerCarrito()).items;
}

/** Agrega unidades. Devuelve { ok, limitadoPorStock } o { ok:false, motivo:'sin-stock' }. */
export const agregarAlCarritoGlobal = (productoId, cantidad = 1) =>
  api('/carrito/items', { method: 'POST', body: { productoId, cantidad } });

export const cambiarCantidadCarrito = (productoId, delta) =>
  api(`/carrito/items/${productoId}`, { method: 'PATCH', body: { delta } });

export const quitarDelCarrito = (productoId) =>
  api(`/carrito/items/${productoId}`, { method: 'DELETE' });

/** Vacía el carrito y también quita el cupón. */
export const vaciarCarritoGlobal = () => api('/carrito', { method: 'DELETE' });

/** Valida el código en MySQL y lo deja aplicado. Lanza ApiError si es inválido. */
export async function aplicarCupon(codigo) {
  const { cupon } = await api('/carrito/cupon', { method: 'PUT', body: { codigo } });
  return cupon;
}

export const quitarCupon = () => api('/carrito/cupon', { method: 'DELETE' });

/** Totales para mostrar. `cupon` es { codigo, porcentaje } o null. (El servidor los recalcula al comprar.) */
export function calcularTotales(items, cupon = null) {
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const descuento = cupon ? Math.round((subtotal * cupon.porcentaje) / 100) : 0;
  return { subtotal, descuento, total: subtotal - descuento };
}
