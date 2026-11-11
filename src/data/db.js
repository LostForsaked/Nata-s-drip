/**
 * Acceso a datos de la tienda.
 *
 * ANTES: leía y escribía en localStorage.
 * AHORA: llama a la API (server/), que guarda todo en MySQL (base "natas_drip").
 *
 * Las funciones tienen los mismos nombres que antes, pero casi todas son async
 * (hay que usar await o .then), porque ahora los datos viajan por la red.
 */
import { api, ApiError } from './api';

const aviso = (evento) => window.dispatchEvent(new Event(evento));
const o404 = (err) => {
  if (err instanceof ApiError && err.status === 404) return null;
  throw err;
};

/* ---------- Funciones puras (no tocan la base) ---------- */

export function esOferta(producto) {
  return Number(producto.descuento) > 0;
}

/** Precio con el descuento de oferta aplicado (entero, en pesos). */
export function precioFinal(producto) {
  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;
  return Math.round(precio * (1 - descuento / 100));
}

/** Nombre de una categoría dentro de una lista ya cargada. */
export function nombreCategoria(id, categorias) {
  const cat = categorias.find((c) => String(c.id) === String(id));
  return cat ? cat.nombre : 'Sin categoría';
}

/* ---------- Categorías ---------- */

export const obtenerCategorias = () => api('/categorias');
export const crearCategoria = (nombre) => api('/categorias', { method: 'POST', body: { nombre } });
export const actualizarCategoria = (id, nombre) =>
  api(`/categorias/${id}`, { method: 'PUT', body: { nombre } });

/** Devuelve false si la categoría tiene productos (no se puede eliminar). */
export async function eliminarCategoria(id) {
  try {
    await api(`/categorias/${id}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return false;
    throw err;
  }
}

/* ---------- Productos ---------- */

export const obtenerProductos = () => api('/productos');
export const obtenerProductosCriticos = () => api('/productos/criticos');
export const buscarProductoPorId = (id) => api(`/productos/${encodeURIComponent(id)}`).catch(o404);
export const crearProducto = (datos) => api('/productos', { method: 'POST', body: datos });
export const actualizarProducto = (id, datos) => api(`/productos/${id}`, { method: 'PUT', body: datos });
export const eliminarProducto = (id) => api(`/productos/${id}`, { method: 'DELETE' });

/* ---------- Usuarios (solo Administrador) ---------- */

export const obtenerUsuarios = () => api('/usuarios');
export const crearUsuario = (datos) => api('/usuarios', { method: 'POST', body: datos });
export const eliminarUsuario = (id) => api(`/usuarios/${id}`, { method: 'DELETE' });

/** Registro público de un cliente nuevo. */
export async function registrarUsuario(datos) {
  const { usuario } = await api('/auth/registro', { method: 'POST', body: datos });
  return usuario;
}

/* ---------- Sesión ---------- */

/** Usuario logueado (sin contraseña) o null. */
export async function obtenerSesion() {
  const { usuario } = await api('/sesion');
  return usuario;
}

export async function iniciarSesion(correo, password) {
  const { usuario } = await api('/auth/login', { method: 'POST', body: { correo, password } });
  aviso('sesionActualizada');
  return usuario;
}

export async function cerrarSesion() {
  await api('/auth/logout', { method: 'POST' });
  aviso('sesionActualizada');
}

/** Edita los datos de la cuenta que tiene la sesión iniciada. */
export async function actualizarPerfil(datos) {
  const { usuario } = await api('/perfil', { method: 'PUT', body: datos });
  aviso('sesionActualizada');
  return usuario;
}

export const cambiarPassword = (actual, nueva) =>
  api('/perfil/password', { method: 'PUT', body: { actual, nueva } });

/* ---------- Órdenes ---------- */

export const obtenerOrdenes = () => api('/ordenes'); // solo Administrador / Vendedor
export const buscarOrdenPorId = (id) => api(`/ordenes/${encodeURIComponent(id)}`).catch(o404);
