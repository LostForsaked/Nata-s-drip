import { ApiError, api } from '../data/api';
import { buscarProductoPorId, obtenerProductos, precioFinal } from '../data/db';

const CLAVE = 'nd_carrito';


export const CUPON_EJEMPLO = 'NATAS10';

function leer() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return { items: Array.isArray(datos?.items) ? datos.items : [], cupon: datos?.cupon ?? null };
  } catch {
    return { items: [], cupon: null };
  }
}

function guardar(carrito) {
  localStorage.setItem(CLAVE, JSON.stringify(carrito));
  window.dispatchEvent(new Event('dbActualizada'));
}


export async function obtenerCarrito() {
  const carrito = leer();
  if (!carrito.items.length) return { items: [], cupon: carrito.cupon };

  const productos = await obtenerProductos();
  const porId = new Map(productos.map((p) => [p.id, p]));
  const items = [];
  for (const { productoId, cantidad } of carrito.items) {
    const producto = porId.get(productoId);
    if (!producto) continue; // el producto ya no existe
    const precioUnitario = precioFinal(producto);
    items.push({
      id: producto.id,
      producto,
      nombre: producto.nombre,
      imagen: producto.imagen,
      cantidad,
      precioUnitario,
      subtotal: precioUnitario * cantidad,
    });
  }
  return { items, cupon: carrito.cupon };
}

export async function detalleCarrito() {
  return (await obtenerCarrito()).items;
}


export async function agregarAlCarritoGlobal(productoId, cantidad = 1) {
  const id = Number(productoId);
  const producto = await buscarProductoPorId(id);
  if (!producto || producto.stock <= 0) return { ok: false, motivo: 'sin-stock' };

  const carrito = leer();
  const linea = carrito.items.find((i) => i.productoId === id);
  const deseada = (linea?.cantidad ?? 0) + cantidad;
  const nueva = Math.min(deseada, producto.stock);
  if (linea) linea.cantidad = nueva;
  else carrito.items.push({ productoId: id, cantidad: nueva });
  guardar(carrito);
  return { ok: true, limitadoPorStock: deseada > nueva };
}


export async function cambiarCantidadCarrito(productoId, delta) {
  const id = Number(productoId);
  const carrito = leer();
  const linea = carrito.items.find((i) => i.productoId === id);
  if (linea) {
    const producto = await buscarProductoPorId(id);
    const nueva = Math.min(linea.cantidad + delta, producto ? producto.stock : 0);
    if (nueva > 0) linea.cantidad = nueva;
    else carrito.items = carrito.items.filter((i) => i.productoId !== id);
    guardar(carrito);
  }
  return obtenerCarrito();
}

export async function quitarDelCarrito(productoId) {
  const id = Number(productoId);
  const carrito = leer();
  carrito.items = carrito.items.filter((i) => i.productoId !== id);
  guardar(carrito);
  return obtenerCarrito();
}


export async function vaciarCarritoGlobal() {
  guardar({ items: [], cupon: null });
  return { items: [], cupon: null };
}


export async function aplicarCupon(codigo) {
  const carrito = leer();
  try {
    const cupon = await api(`/cupones/${encodeURIComponent(String(codigo).trim())}`);
    carrito.cupon = { codigo: cupon.codigo, porcentaje: cupon.porcentaje };
    guardar(carrito);
    return carrito.cupon;
  } catch (err) {
    carrito.cupon = null;
    guardar(carrito);
    if (err instanceof ApiError && err.status !== 0) throw new ApiError(400, 'Cupón inválido.', 'cupon');
    throw err;
  }
}

export async function quitarCupon() {
  const carrito = leer();
  carrito.cupon = null;
  guardar(carrito);
}

export function calcularTotales(items, cupon = null) {
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const descuento = cupon ? Math.round((subtotal * cupon.porcentaje) / 100) : 0;
  return { subtotal, descuento, total: subtotal - descuento };
}