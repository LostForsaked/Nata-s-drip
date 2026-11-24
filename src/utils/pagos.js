import { api, ApiError } from '../data/api';
import { guardarUltimaOrden, leerUltimaOrden, resolverComunaId } from '../data/db';
import { obtenerCarrito, vaciarCarritoGlobal } from './cardLogic';


const capacidadDe = (ordenId) => {
  const ultima = leerUltimaOrden();
  return ultima && String(ultima.id) === String(ordenId) ? ultima.capacidadPago : undefined;
};


export async function crearOrdenPendiente({ cliente, direccion }) {
  const { items, cupon } = await obtenerCarrito();
  if (!items.length) throw new ApiError(400, 'Tu carrito está vacío.');

  const idComuna = await resolverComunaId(direccion.region, direccion.comuna);
  const orden = await api('/ordenes', {
    method: 'POST',
    body: {
      cliente: { nombre: cliente.nombre, apellidos: cliente.apellidos, correo: cliente.correo },
      direccion: {
        calle: direccion.calle,
        departamento: direccion.departamento || null,
        idComuna,
        indicaciones: direccion.indicaciones || null,
      },
      items: items.map((i) => ({ productoId: i.id, cantidad: i.cantidad })),
      cupon: cupon?.codigo ?? null,
    },
  });
  guardarUltimaOrden(orden);
  return orden;
}

//pago aprobado
export async function aprobarPago(ordenId) {
  try {
    const capacidadPago = capacidadDe(ordenId);
    const orden = await api(`/ordenes/${ordenId}/pagar`, {
      method: 'POST',
      body: { capacidadPago },
    });
    guardarUltimaOrden({ ...orden, capacidadPago });
    await vaciarCarritoGlobal(); 
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, error: err.message };
    throw err;
  }
}

//pago rechazado
export async function rechazarPago(ordenId) {
  const capacidadPago = capacidadDe(ordenId);
  const orden = await api(`/ordenes/${ordenId}/rechazar`, {
    method: 'POST',
    body: { capacidadPago },
  });
  guardarUltimaOrden({ ...orden, capacidadPago });
  return { ok: true, orden };
}