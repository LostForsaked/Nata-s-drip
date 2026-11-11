/**
 * Órdenes y pagos simulados (modo demostración).
 * La lógica crítica ahora corre en el servidor dentro de transacciones MySQL:
 * verificar stock, descontarlo, marcar la orden como Pagada y vaciar el carrito.
 */
import { api, ApiError } from '../data/api';

/**
 * Crea la orden "pendiente de pago" con el carrito y cupón guardados en la sesión.
 * Lanza ApiError (409) si algún producto no tiene stock suficiente.
 */
export const crearOrdenPendiente = ({ cliente, direccion }) =>
  api('/ordenes', { method: 'POST', body: { cliente, direccion } });

/** Pago aprobado. Devuelve { ok: true } o { ok: false, error } (p. ej. sin stock). */
export async function aprobarPago(ordenId) {
  try {
    await api(`/ordenes/${ordenId}/pagar`, { method: 'POST' });
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, error: err.message };
    throw err;
  }
}

/** Pago rechazado: la orden queda como "Pago fallido" y el carrito se conserva. */
export const rechazarPago = (ordenId) => api(`/ordenes/${ordenId}/rechazar`, { method: 'POST' });
