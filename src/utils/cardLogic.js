import { DB_KEYS, obtenerProductos, buscarProductoPorId, precioFinal } from "../data/db";

export const CUPON = { codigo: "NATAS10", porcentaje: 10};

const CLAVE_CUPON = "50off";

export function cuponGuardado() {
  return localStorage.getItem(CLAVE_CUPON) === CUPON.codigo;
}

export function guardarCupon(aplicado) {
  if (aplicado) localStorage.setItem(CLAVE_CUPON, CUPON.codigo);
  else localStorage.removeItem(CLAVE_CUPON);
}

function guardar(carrito){
  localStorage.setItem(DB_KEYS.carrito, JSON.stringify(carrito));
  window.dispatchEvent(new Event("carritoActualizado"));
}

export function obtenerCarrito(){
  let carrito;
  try{
    carrito = JSON.parse(localStorage.getItem(DB_KEYS.carrito) || "[]");
  }catch{
    carrito = [];
  }
  if (!Array.isArray(carrito)) return [];

  const idsValidos = new Set(obtenerProductos().map((p) => String(p.id)));
  return carrito.filter((item) => idsValidos.has(String(item.id)));
}

export function agregarAlCarritoGlobal(productoId, cantidad = 1){
  const producto = buscarProductoPorId(productoId);
  if (!producto || Number(producto.stock) <=0){
    return {ok: false, motivo: "sin-stock"};
  }

  const carrito = obtenerCarrito();
  const item = carrito.find((i) => String(i.id)=== String(productoId));
  const actual = item ? item.cantidad : 0;
  const deseada = actual + Number(cantidad);
  const nueva = Math.min(deseada, Number(producto.stock));

  if (item) item.cantidad = nueva;
  else carrito.push({id: producto.id, cantidad: nueva});

  guardar(carrito);
  return {ok: true, limitadoPorStock: deseada > nueva};
}

export function cambiarCantidadCarrito(productoId, delta) {
  const producto = buscarProductoPorId(productoId);
  const carrito = obtenerCarrito()
    .map((item) => {
      if (String(item.id) !== String(productoId)) return item;
      const nueva = Math.min(item.cantidad + delta, Number(producto?.stock ?? item.cantidad));
      return nueva > 0 ? { ...item, cantidad: nueva } : null;
    })
    .filter(Boolean);
  guardar(carrito);
}

export function quitarDelCarrito(productoId) {
  guardar(obtenerCarrito().filter((i) => String(i.id) !== String(productoId)));
}

export function vaciarCarritoGlobal() {
  localStorage.removeItem(DB_KEYS.carrito);
  localStorage.removeItem(CLAVE_CUPON);
  window.dispatchEvent(new Event("carritoActualizado"));
}

export function detalleCarrito() {
  return obtenerCarrito()
    .map((item) => {
      const producto = buscarProductoPorId(item.id);
      if (!producto) return null;
      const precioUnitario = precioFinal(producto);
      return {
        id: producto.id,
        producto,
        nombre: producto.nombre,
        imagen: producto.imagen,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal: precioUnitario * item.cantidad,
      };
    })
    .filter(Boolean);
}

export function cuponEsValido(texto) {
  return String(texto).trim().toUpperCase() === CUPON.codigo;
}

export function calcularTotales(items, cuponAplicado = false) {
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const descuento = cuponAplicado ? Math.round((subtotal * CUPON.porcentaje) / 100) : 0;
  return { subtotal, descuento, total: subtotal - descuento };
}