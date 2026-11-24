import { api, ApiError, guardarToken, leerToken, quitarToken } from './api';

const aviso = (evento) => window.dispatchEvent(new Event(evento));
const o404 = (err) => {
  if (err instanceof ApiError && err.status === 404) return null;
  throw err;
};
const aEntero = (v) => (v === '' || v === null || v === undefined ? null : Math.round(Number(v)));



export function esOferta(producto) {
  return Number(producto.descuento) > 0;
}


export function precioFinal(producto) {
  if (producto.precioFinal !== undefined && producto.precioFinal !== null) return producto.precioFinal;
  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;
  return Math.round(precio * (1 - descuento / 100));
}


export function nombreCategoria(id, categorias) {
  const cat = categorias.find((c) => String(c.id) === String(id));
  return cat ? cat.nombre : 'Sin categoría';
}



const aProducto = (p) => ({
  id: p.id,
  codigo: p.codigo,
  nombre: p.nombre,
  descripcion: p.descripcion ?? '',
  imagen: p.imagen || '/img/Logo.jpg',
  precio: p.precio,
  stock: p.stock,
  stockCritico: p.stockCritico ?? '', 
  descuento: p.descuento,
  precioFinal: p.precioFinal,
  categoriaId: p.idCategoria,
  categoria: p.categoria,
});

const aUsuario = (u) => ({
  id: u.id,
  run: u.run ?? '',
  nombre: u.nombre,
  apellidos: u.apellidos,
  correo: u.correo,
  telefono: u.telefono ?? '',
  fechaNacimiento: u.fechaNacimiento ?? '',
  rol: u.rol,
  region: u.region ?? '',
  comuna: u.comuna ?? '',
  direccion: u.direccion ?? '',
});


const aOrden = (o) => ({ ...o, estado: o.estado === 'Pendiente de pago' ? 'pendiente de pago' : o.estado });



let cacheUbicaciones = null;

async function cargarUbicaciones() {
  if (!cacheUbicaciones) {
    const regiones = await api('/regiones');
    const comunas = await Promise.all(regiones.map((r) => api(`/regiones/${r.id}/comunas`)));
    cacheUbicaciones = regiones.map((r, i) => ({ ...r, comunas: comunas[i] }));
  }
  return cacheUbicaciones;
}

const norm = (texto) => String(texto ?? '').trim().toLowerCase();


export async function resolverComunaId(nombreRegion, nombreComuna) {
  const ubicaciones = await cargarUbicaciones();
  const region = ubicaciones.find((r) => norm(r.nombre) === norm(nombreRegion));
  const comuna = region?.comunas.find((c) => norm(c.nombre) === norm(nombreComuna));
  if (!comuna) throw new ApiError(400, 'Selecciona una región y una comuna válidas.', 'comuna');
  return comuna.id;
}

async function resolverRolId(nombreRol) {
  const roles = await api('/roles');
  const rol = roles.find((r) => norm(r.nombre) === norm(nombreRol));
  if (!rol) throw new ApiError(400, 'El rol no es válido.', 'rol');
  return rol.id;
}



export const obtenerCategorias = () => api('/categorias');
export const crearCategoria = (nombre) => api('/categorias', { method: 'POST', body: { nombre } });
export const actualizarCategoria = (id, nombre) =>
  api(`/categorias/${id}`, { method: 'PUT', body: { nombre } });


export async function eliminarCategoria(id) {
  try {
    await api(`/categorias/${id}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return false;
    throw err;
  }
}



const cuerpoProducto = (d) => ({
  codigo: String(d.codigo ?? '').trim(),
  nombre: String(d.nombre ?? '').trim(),
  descripcion: String(d.descripcion ?? '').trim() || null,
  imagen: d.imagen || null,
  precio: aEntero(d.precio),
  descuento: aEntero(d.descuento) ?? 0,
  stock: aEntero(d.stock),
  stockCritico: aEntero(d.stockCritico),
  idCategoria: aEntero(d.categoriaId),
});

export const obtenerProductos = async () => (await api('/productos')).map(aProducto);
export const obtenerProductosCriticos = async () => (await api('/productos/criticos')).map(aProducto);
export const buscarProductoPorId = (id) =>
  api(`/productos/${encodeURIComponent(id)}`).then(aProducto).catch(o404);
export const crearProducto = async (datos) =>
  aProducto(await api('/productos', { method: 'POST', body: cuerpoProducto(datos) }));
export const actualizarProducto = async (id, datos) =>
  aProducto(await api(`/productos/${id}`, { method: 'PUT', body: cuerpoProducto(datos) }));
export const eliminarProducto = (id) => api(`/productos/${id}`, { method: 'DELETE' });



export const obtenerUsuarios = async () => (await api('/usuarios')).map(aUsuario);
export const eliminarUsuario = (id) => api(`/usuarios/${id}`, { method: 'DELETE' });

const limpiarRun = (run) => String(run ?? '').trim().toUpperCase().replace(/[.\-]/g, '');


export async function crearUsuario(datos) {
  const [idComuna, idRol] = await Promise.all([
    resolverComunaId(datos.region, datos.comuna),
    resolverRolId(datos.rol),
  ]);
  const usuario = await api('/usuarios', {
    method: 'POST',
    body: {
      run: limpiarRun(datos.run),
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo,
      password: datos.password,
      telefono: datos.telefono || null,
      fechaNacimiento: datos.fechaNacimiento || null,
      direccion: datos.direccion,
      idComuna,
      idRol,
    },
  });
  return aUsuario(usuario);
}


export async function registrarUsuario(datos) {
  const idComuna = await resolverComunaId(datos.region, datos.comuna);
  const respuesta = await api('/auth/registro', {
    method: 'POST',
    body: {
      run: limpiarRun(datos.run),
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo,
      password: datos.password,
      telefono: datos.telefono || null,
      fechaNacimiento: datos.fechaNacimiento || null,
      direccion: datos.direccion,
      idComuna,
    },
  });
  return respuesta.usuario;
}




export async function obtenerSesion() {
  if (!leerToken()) return null;
  try {
    return aUsuario(await api('/perfil'));
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function iniciarSesion(correo, password) {
  const respuesta = await api('/auth/login', { method: 'POST', body: { correo, password } });
  guardarToken(respuesta.token);
  const usuario = await obtenerSesion();
  aviso('sesionActualizada');
  return usuario;
}

export async function cerrarSesion() {
  quitarToken();
  aviso('sesionActualizada');
}


export async function actualizarPerfil(datos) {
  const idComuna = await resolverComunaId(datos.region, datos.comuna);
  const usuario = await api('/perfil', {
    method: 'PUT',
    body: {
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      telefono: datos.telefono || null,
      fechaNacimiento: datos.fechaNacimiento || null,
      direccion: datos.direccion,
      idComuna,
    },
  });
  aviso('sesionActualizada');
  return aUsuario(usuario);
}

export const cambiarPassword = (actual, nueva) =>
  api('/perfil/password', { method: 'PUT', body: { actual, nueva } });



const CLAVE_ULTIMA = 'nd_ultima_orden';


export function guardarUltimaOrden(orden) {
  sessionStorage.setItem(CLAVE_ULTIMA, JSON.stringify(orden));
}

export function leerUltimaOrden() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_ULTIMA));
  } catch {
    return null;
  }
}

export const obtenerOrdenes = async () => (await api('/ordenes')).map(aOrden); // solo Administrador / Vendedor

export async function buscarOrdenPorId(id) {
  try {
    return aOrden(await api(`/ordenes/${encodeURIComponent(id)}`));
  } catch (err) {
    if (err instanceof ApiError && [401, 403, 404].includes(err.status)) {
      const ultima = leerUltimaOrden();
      return ultima && String(ultima.id) === String(id) ? aOrden(ultima) : null;
    }
    throw err;
  }
}