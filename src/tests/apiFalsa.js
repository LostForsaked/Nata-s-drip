// API falsa en memoria para probar el contrato REST del backend Spring Boot.
import { vi } from 'vitest';

const ADMIN = { id: 1, run: '111111111', nombre: 'Admin', apellidos: 'Nata', correo: 'admin@gmail.com', telefono: '', fechaNacimiento: '', rol: 'Administrador', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Calle 1' };
const CLIENTE = { ...ADMIN, id: 4, nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com', rol: 'Cliente' };

export const USUARIOS = { admin: ADMIN, cliente: CLIENTE };

const REGION = { id: 7, nombre: 'Región Metropolitana de Santiago' };
const COMUNAS = [
  { id: 131, nombre: 'Santiago' },
  { id: 118, nombre: 'Providencia' },
];

const CATEGORIAS = [
  { id: 1, nombre: 'Memes' },
  { id: 2, nombre: 'Bandas' },
];

const producto = (id, extra = {}) => ({
  id, codigo: `P00${id}`, nombre: `Producto ${id}`, descripcion: 'Descripción', imagen: '/img/Logo.jpg',
  precio: 14990, stock: 20, stockCritico: 5, descuento: 0, idCategoria: 1, categoria: 'Memes', ...extra,
});
const PRODUCTOS = [producto(1), producto(2, { descuento: 20 }), producto(3, { stock: 3, idCategoria: 2, categoria: 'Bandas' })];

const orden = (id, estado) => ({
  id, numero: `ND-20260101-000${id}`, estado, usuarioId: 4,
  cliente: { nombre: 'Cliente', apellidos: 'De prueba', correo: 'cliente@gmail.com' },
  direccion: { calle: 'Calle 123', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', indicaciones: '' },
  items: [{ productoId: 1, nombre: 'Producto 1', imagen: '/img/Logo.jpg', precioUnitario: 14990, cantidad: 1, subtotal: 14990 }],
  subtotal: 14990, descuento: 0, total: 14990, cupon: null,
  fecha: '2026-01-01T12:00:00.000Z', fechaPago: estado === 'Pagada' ? '2026-01-01T12:05:00.000Z' : null,
});

/**
 * Reemplaza fetch por una API falsa. Devuelve { llamadas, estado } para poder
 * revisar las peticiones del frontend. `usuario` = sesión activa (o null).
 */
export function instalarApiFalsa({ usuario = ADMIN } = {}) {
  const estado = { usuario, productos: structuredClone(PRODUCTOS) };
  const llamadas = [];

  if (usuario) localStorage.setItem('nd_token', 'test-token');
  else localStorage.removeItem('nd_token');

  const json = (datos, status = 200) =>
    new Response(datos === null ? null : JSON.stringify(datos), { status });
  const error = (status, mensaje, campo) =>
    json({ status, error: 'Error', mensaje, campos: campo ? { [campo]: mensaje } : {} }, status);

  const fetchFalso = vi.fn(async (url, opciones = {}) => {
    const metodo = opciones.method ?? 'GET';
    const ruta = String(url).replace(/^\/api\/v1/, '').split('?')[0];
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : undefined;
    llamadas.push({ metodo, ruta, cuerpo });

    if (metodo === 'GET') {
      if (ruta === '/perfil') return estado.usuario ? json(estado.usuario) : error(401, 'Debes iniciar sesión.');
      if (ruta === '/roles') return json([{ id: 1, nombre: 'Administrador' }, { id: 2, nombre: 'Vendedor' }, { id: 3, nombre: 'Cliente' }]);
      if (ruta === '/regiones') return json([REGION]);
      if (ruta === `/regiones/${REGION.id}/comunas`) return json(COMUNAS);
      if (ruta === '/categorias') return json(CATEGORIAS);
      if (ruta === '/productos') return json(estado.productos);
      if (ruta === '/productos/criticos') return json(estado.productos.filter((p) => p.stock <= p.stockCritico));
      if (ruta.startsWith('/productos/')) {
        const p = estado.productos.find((x) => String(x.id) === ruta.split('/')[2]);
        return p ? json(p) : error(404, 'Producto no encontrado.');
      }
      if (ruta === '/usuarios') return json([ADMIN, CLIENTE]);
      if (ruta === '/ordenes') return json([orden(1, 'Pagada'), orden(2, 'Pago fallido')]);
      if (ruta === '/cupones/NATAS10') return json({ codigo: 'NATAS10', porcentaje: 10 });
      if (ruta.startsWith('/ordenes/')) {
        const id = Number(ruta.split('/')[2]);
        return id === 1 ? json(orden(1, 'Pagada')) : id === 2 ? json(orden(2, 'Pago fallido')) : error(404, 'Orden no encontrada.');
      }
    }

    if (metodo === 'POST' && ruta === '/auth/login') {
      if (cuerpo.password !== 'admin') return error(401, 'Correo o contraseña incorrectos.', 'password');
      estado.usuario = ADMIN;
      return json({ token: 'test-token', tipo: 'Bearer', expiraEnMinutos: 120, usuario: ADMIN });
    }
    if (metodo === 'PUT' && ruta === '/perfil') {
      estado.usuario = { ...estado.usuario, ...cuerpo, region: REGION.nombre, comuna: COMUNAS[0].nombre };
      return json(estado.usuario);
    }
    if (metodo === 'POST' && ruta === '/productos') {
      return json({ ...producto(4), ...cuerpo, id: 4, categoria: 'Memes' }, 201);
    }
    if (metodo === 'DELETE' && ruta.startsWith('/productos/')) return json(null, 204);
    if (metodo === 'DELETE' && ruta.startsWith('/categorias/')) {
      return ruta.endsWith('/1') ? error(409, 'No puedes eliminar una categoría que tiene productos.') : json(null, 204);
    }
    if (metodo === 'POST' && /^\/ordenes\/\d+\/pagar$/.test(ruta)) {
      return json(orden(Number(ruta.split('/')[2]), 'Pagada'));
    }
    if (metodo === 'POST' && ruta === '/auth/registro') {
      return cuerpo.correo === 'admin@gmail.com'
        ? error(409, 'Este correo ya está registrado.', 'correo')
        : json({ token: 'test-token', tipo: 'Bearer', expiraEnMinutos: 120, usuario: { ...CLIENTE, ...cuerpo } }, 201);
    }
    return error(404, 'No existe la ruta solicitada.');
  });

  vi.stubGlobal('fetch', fetchFalso);
  return { llamadas, estado, fetchFalso };
}
