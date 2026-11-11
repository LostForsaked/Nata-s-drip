// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crearApp } from '../app.js';
import { pool } from '../db.js';

let servidor;
let base;

/** Cliente HTTP con "cookie jar": cada instancia es un navegador distinto. */
function navegador() {
  let cookie = '';
  const llamar = async (metodo, ruta, cuerpo) => {
    const res = await fetch(base + ruta, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
    const nueva = res.headers.getSetCookie?.().find((c) => c.startsWith('nd_sid='));
    if (nueva) cookie = nueva.split(';')[0];
    const texto = await res.text();
    return { status: res.status, data: texto ? JSON.parse(texto) : null, cookie };
  };
  return {
    get: (r) => llamar('GET', r),
    post: (r, b = {}) => llamar('POST', r, b),
    put: (r, b = {}) => llamar('PUT', r, b),
    patch: (r, b = {}) => llamar('PATCH', r, b),
    del: (r) => llamar('DELETE', r),
    get cookie() { return cookie; },
  };
}

const ENVIO = {
  cliente: { nombre: 'Juan', apellidos: 'Pérez', correo: 'juan@gmail.com' },
  direccion: { calle: 'Calle 123', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', indicaciones: '' },
};

beforeAll(async () => {
  servidor = crearApp().listen(0);
  base = `http://127.0.0.1:${servidor.address().port}/api`;
});

afterAll(async () => {
  servidor.close();
  await pool.end();
});

describe('Catálogo público', () => {
  it('lista los 12 productos iniciales con la forma que usa el frontend', async () => {
    const { status, data } = await navegador().get('/productos');
    expect(status).toBe(200);
    expect(data).toHaveLength(12);
    expect(data[0]).toMatchObject({
      id: 1, codigo: 'P001', nombre: 'Afraid of Women', precio: 14990,
      stock: 20, stockCritico: 5, descuento: 0, categoriaId: 1, categoria: 'Memes',
    });
  });

  it('lista las categorías y busca un producto por id', async () => {
    const n = navegador();
    expect((await n.get('/categorias')).data.map((c) => c.nombre)).toEqual(['Memes', 'Bandas', 'Cine y series']);
    expect((await n.get('/productos/3')).data.descuento).toBe(20);
    expect((await n.get('/productos/9999')).status).toBe(404);
  });
});

describe('Sesión y login', () => {
  it('un visitante nuevo no tiene usuario y recibe una cookie httpOnly', async () => {
    const n = navegador();
    const { data, cookie } = await n.get('/sesion');
    expect(data.usuario).toBeNull();
    expect(cookie).toMatch(/^nd_sid=[a-f0-9]{64}$/);
  });

  it('rechaza credenciales incorrectas', async () => {
    const n = navegador();
    const r = await n.post('/auth/login', { correo: 'admin@gmail.com', password: 'mala' });
    expect(r.status).toBe(401);
    expect(r.data.error).toBe('Correo o contraseña incorrectos.');
  });

  it('inicia y cierra sesión sin exponer la contraseña', async () => {
    const n = navegador();
    const r = await n.post('/auth/login', { correo: 'ADMIN@gmail.com', password: 'admin' });
    expect(r.status).toBe(200);
    expect(r.data.usuario).toMatchObject({ nombre: 'Admin', rol: 'Administrador' });
    expect(JSON.stringify(r.data)).not.toMatch(/password|hash|\$2b\$/);
    expect((await n.get('/sesion')).data.usuario.correo).toBe('admin@gmail.com');

    await n.post('/auth/logout');
    expect((await n.get('/sesion')).data.usuario).toBeNull();
  });

  it('las contraseñas están guardadas como hash bcrypt', async () => {
    const [[fila]] = await pool.query("SELECT password_hash FROM usuarios WHERE correo = 'admin@gmail.com'");
    expect(fila.password_hash).toMatch(/^\$2[aby]\$10\$/);
  });
});

describe('Permisos', () => {
  it('sin sesión no se puede administrar', async () => {
    const n = navegador();
    expect((await n.get('/usuarios')).status).toBe(401);
    expect((await n.get('/ordenes')).status).toBe(401);
    expect((await n.post('/productos', {})).status).toBe(401);
  });

  it('un cliente o vendedor no puede crear productos ni ver usuarios', async () => {
    const cliente = navegador();
    await cliente.post('/auth/login', { correo: 'cliente@gmail.com', password: '1234' });
    expect((await cliente.get('/usuarios')).status).toBe(403);
    expect((await cliente.get('/ordenes')).status).toBe(403);

    const vendedor = navegador();
    await vendedor.post('/auth/login', { correo: 'vendedor@gmail.com', password: '1234' });
    expect((await vendedor.post('/productos', {})).status).toBe(403);
    expect((await vendedor.get('/ordenes')).status).toBe(200);
    expect((await vendedor.get('/productos/criticos')).data.map((p) => p.codigo)).toEqual(['P009', 'P004']);
  });
});

describe('Carrito y cupón (guardados en MySQL)', () => {
  it('agrega, limita por stock, cambia cantidades y aplica el cupón', async () => {
    const n = navegador();
    expect((await n.post('/carrito/items', { productoId: 4, cantidad: 2 })).data).toEqual({ ok: true, limitadoPorStock: false });
    // P004 tiene stock 4: pedir 10 más se limita a 4
    expect((await n.post('/carrito/items', { productoId: 4, cantidad: 10 })).data).toEqual({ ok: true, limitadoPorStock: true });
    await n.post('/carrito/items', { productoId: 3, cantidad: 1 }); // 20% dcto -> 11.992

    let { data } = await n.get('/carrito');
    expect(data.items.map((i) => [i.id, i.cantidad])).toEqual([[4, 4], [3, 1]]);
    expect(data.items[1].precioUnitario).toBe(11992);
    expect(data.cupon).toBeNull();

    data = (await n.patch('/carrito/items/4', { delta: -1 })).data;
    expect(data.items[0].cantidad).toBe(3);

    expect((await n.put('/carrito/cupon', { codigo: 'mala' })).status).toBe(400);
    expect((await n.put('/carrito/cupon', { codigo: ' natas10 ' })).data.cupon).toEqual({ codigo: 'NATAS10', porcentaje: 10 });
    expect((await n.get('/carrito')).data.cupon.codigo).toBe('NATAS10');

    data = (await n.del('/carrito/items/3')).data;
    expect(data.items).toHaveLength(1);
    data = (await n.del('/carrito')).data;
    expect(data).toEqual({ items: [], cupon: null });
  });

  it('un producto sin stock no se puede agregar; carritos de distintos visitantes no se mezclan', async () => {
    const a = navegador();
    const b = navegador();
    await a.post('/carrito/items', { productoId: 1, cantidad: 1 });
    expect((await b.get('/carrito')).data.items).toHaveLength(0);
    expect((await a.post('/carrito/items', { productoId: 9999 })).data).toEqual({ ok: false, motivo: 'sin-stock' });
  });

  it('el carrito se conserva al iniciar sesión', async () => {
    const n = navegador();
    await n.post('/carrito/items', { productoId: 2, cantidad: 2 });
    await n.post('/auth/login', { correo: 'cliente@gmail.com', password: '1234' });
    expect((await n.get('/carrito')).data.items[0]).toMatchObject({ id: 2, cantidad: 2 });
  });
});

describe('Compra completa', () => {
  it('crea la orden desde el carrito, la paga, descuenta stock y vacía el carrito', async () => {
    const n = navegador();
    await n.post('/auth/login', { correo: 'cliente@gmail.com', password: '1234' });
    await n.post('/carrito/items', { productoId: 5, cantidad: 2 });
    await n.post('/carrito/items', { productoId: 3, cantidad: 1 });
    await n.put('/carrito/cupon', { codigo: 'NATAS10' });

    const creada = await n.post('/ordenes', ENVIO);
    expect(creada.status).toBe(201);
    const orden = creada.data;
    expect(orden.estado).toBe('pendiente de pago');
    expect(orden.numero).toMatch(/^ND-\d{8}-\d{4}$/);
    expect(orden.subtotal).toBe(14990 * 2 + 11992);
    expect(orden.descuento).toBe(Math.round(orden.subtotal * 0.1));
    expect(orden.total).toBe(orden.subtotal - orden.descuento);
    expect(orden.cupon).toBe('NATAS10');
    expect(orden.items).toHaveLength(2);
    expect(orden.items[0].imagen).toBe('/img/catparade.webp');

    // Aún no se descontó el stock
    expect((await n.get('/productos/5')).data.stock).toBe(20);

    const pago = await n.post(`/ordenes/${orden.id}/pagar`);
    expect(pago.data.ok).toBe(true);
    expect(pago.data.orden.estado).toBe('Pagada');
    expect(pago.data.orden.fechaPago).toBeTruthy();
    expect((await n.get('/productos/5')).data.stock).toBe(18);
    expect((await n.get('/productos/3')).data.stock).toBe(19);
    expect((await n.get('/carrito')).data).toEqual({ items: [], cupon: null });

    // Pagar de nuevo no descuenta dos veces
    await n.post(`/ordenes/${orden.id}/pagar`);
    expect((await n.get('/productos/5')).data.stock).toBe(18);
  });

  it('un pago rechazado deja la orden como "Pago fallido" y conserva el carrito; luego se puede reintentar', async () => {
    const n = navegador();
    await n.post('/carrito/items', { productoId: 6, cantidad: 1 }); // invitado
    const { data: orden } = await n.post('/ordenes', ENVIO);
    expect(orden.usuarioId).toBeNull();

    const r = await n.post(`/ordenes/${orden.id}/rechazar`);
    expect(r.data.orden.estado).toBe('Pago fallido');
    expect((await n.get('/carrito')).data.items).toHaveLength(1);

    expect((await n.post(`/ordenes/${orden.id}/pagar`)).data.orden.estado).toBe('Pagada');
    expect((await n.get('/carrito')).data.items).toHaveLength(0);
  });

  it('no deja pagar si el stock se agotó mientras tanto (y no descuenta nada)', async () => {
    const comprador = navegador();
    await comprador.post('/carrito/items', { productoId: 9, cantidad: 3 }); // stock 3
    const { data: orden } = await comprador.post('/ordenes', ENVIO);

    const admin = navegador();
    await admin.post('/auth/login', { correo: 'admin@gmail.com', password: 'admin' });
    await admin.put('/productos/9', { stock: 1 });

    const r = await comprador.post(`/ordenes/${orden.id}/pagar`);
    expect(r.status).toBe(409);
    expect(r.data.error).toBe('solo quedan 1 unidades de "Asking Alexandria" (pediste 3).');
    expect((await comprador.get('/productos/9')).data.stock).toBe(1);
    expect((await comprador.get(`/ordenes/${orden.id}`)).data.estado).toBe('pendiente de pago');
  });

  it('no crea la orden con el carrito vacío ni con datos de envío inválidos', async () => {
    const n = navegador();
    expect((await n.post('/ordenes', ENVIO)).data.error).toBe('Tu carrito está vacío.');
    await n.post('/carrito/items', { productoId: 1, cantidad: 1 });
    const mal = await n.post('/ordenes', { ...ENVIO, cliente: { ...ENVIO.cliente, correo: 'x@hotmail.com' } });
    expect(mal.status).toBe(400);
    expect(mal.data.campo).toBe('correo');
  });

  it('cada persona solo ve sus órdenes; el staff ve todas', async () => {
    const dueño = navegador();
    await dueño.post('/carrito/items', { productoId: 7, cantidad: 1 });
    const { data: orden } = await dueño.post('/ordenes', ENVIO);

    const otro = navegador();
    expect((await otro.get(`/ordenes/${orden.id}`)).status).toBe(404);
    expect((await otro.post(`/ordenes/${orden.id}/pagar`)).status).toBe(404);

    const vendedor = navegador();
    await vendedor.post('/auth/login', { correo: 'vendedor@gmail.com', password: '1234' });
    expect((await vendedor.get(`/ordenes/${orden.id}`)).status).toBe(200);
    expect((await vendedor.get('/ordenes')).data.length).toBeGreaterThanOrEqual(4);
    expect((await vendedor.post(`/ordenes/${orden.id}/pagar`)).status).toBe(404); // el staff no paga por otros
  });
});

describe('Administración de productos y categorías', () => {
  async function admin() {
    const n = navegador();
    await n.post('/auth/login', { correo: 'admin@gmail.com', password: 'admin' });
    return n;
  }
  const PRODUCTO = { codigo: 'TEST-01', nombre: 'Polera test', descripcion: 'x', precio: 9990, stock: 7, stockCritico: '', descuento: 0, categoriaId: 1, imagen: '' };

  it('crea, edita y elimina un producto', async () => {
    const a = await admin();
    const creado = await a.post('/productos', PRODUCTO);
    expect(creado.status).toBe(201);
    expect(creado.data).toMatchObject({ codigo: 'TEST-01', stockCritico: '', imagen: '/img/Logo.jpg', categoria: 'Memes' });

    const edit = await a.put(`/productos/${creado.data.id}`, { nombre: 'Polera editada', stockCritico: 3, descuento: 25 });
    expect(edit.data).toMatchObject({ nombre: 'Polera editada', stockCritico: 3, descuento: 25, codigo: 'TEST-01' });

    expect((await a.del(`/productos/${creado.data.id}`)).status).toBe(204);
    expect((await a.get(`/productos/${creado.data.id}`)).status).toBe(404);
  });

  it('rechaza código repetido (índice UNIQUE) y datos inválidos', async () => {
    const a = await admin();
    const dup = await a.post('/productos', { ...PRODUCTO, codigo: 'p001' }); // distinto de mayúsculas
    expect(dup.status).toBe(409);
    expect(dup.data.campo).toBe('codigo');
    expect((await a.post('/productos', { ...PRODUCTO, codigo: 'T2', precio: -5 })).status).toBe(400);
    expect((await a.post('/productos', { ...PRODUCTO, codigo: 'TEST-02', categoriaId: 999 })).status).toBe(400);
  });

  it('la boleta no cambia aunque se elimine el producto vendido', async () => {
    const a = await admin();
    const { data: p } = await a.post('/productos', { ...PRODUCTO, codigo: 'TEST-03', nombre: 'Efímera' });
    const n = navegador();
    await n.post('/carrito/items', { productoId: p.id, cantidad: 1 });
    const { data: orden } = await n.post('/ordenes', ENVIO);
    await n.post(`/ordenes/${orden.id}/pagar`);

    await a.del(`/productos/${p.id}`);
    const boleta = (await a.get(`/ordenes/${orden.id}`)).data;
    expect(boleta.estado).toBe('Pagada');
    expect(boleta.items[0]).toMatchObject({ nombre: 'Efímera', productoId: null, imagen: '/img/Logo.jpg', subtotal: 9990 });
  });

  it('CRUD de categorías, sin duplicados y sin borrar las que tienen productos', async () => {
    const a = await admin();
    const nueva = await a.post('/categorias', { nombre: '  Pruebas  ' });
    expect(nueva.data.nombre).toBe('Pruebas');
    expect((await a.post('/categorias', { nombre: 'pruebas' })).status).toBe(409);
    expect((await a.put(`/categorias/${nueva.data.id}`, { nombre: 'Renombrada' })).data.nombre).toBe('Renombrada');
    expect((await a.del('/categorias/1')).status).toBe(409);
    expect((await a.del(`/categorias/${nueva.data.id}`)).status).toBe(204);
  });
});

describe('Usuarios y perfil', () => {
  const REGISTRO = {
    run: '12.345.679-3', nombre: 'Nuevo', apellidos: 'Cliente', correo: 'nuevo@gmail.com', password: 'abcd',
    telefono: '', fechaNacimiento: '2000-05-17', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Calle 1',
  };

  it('registra un cliente (siempre rol Cliente), evita correos repetidos y permite iniciar sesión', async () => {
    const n = navegador();
    const r = await n.post('/auth/registro', { ...REGISTRO, rol: 'Administrador' });
    expect(r.status).toBe(201);
    expect(r.data.usuario).toMatchObject({ rol: 'Cliente', fechaNacimiento: '2000-05-17', run: '123456793' });

    const dup = await n.post('/auth/registro', { ...REGISTRO, run: '152345674' });
    expect(dup.status).toBe(409);
    expect(dup.data.campo).toBe('correo');
    expect((await n.post('/auth/registro', { ...REGISTRO, correo: 'otro@gmail.com' })).data.campo).toBe('run');
    expect((await n.post('/auth/registro', { ...REGISTRO, run: '1', correo: 'z@gmail.com' })).status).toBe(400);

    expect((await n.post('/auth/login', { correo: 'nuevo@gmail.com', password: 'abcd' })).status).toBe(200);
  });

  it('el cliente edita su perfil y cambia su contraseña', async () => {
    const n = navegador();
    await n.post('/auth/login', { correo: 'nuevo@gmail.com', password: 'abcd' });

    const ok = await n.put('/perfil', { nombre: 'Nuevo2', apellidos: 'Cliente', telefono: '987654321', region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa', direccion: 'Calle 2' });
    expect(ok.data.usuario).toMatchObject({ nombre: 'Nuevo2', comuna: 'Ñuñoa', telefono: '987654321' });
    expect((await n.put('/perfil', { ...ok.data.usuario, telefono: 'abc' })).status).toBe(400);

    expect((await n.put('/perfil/password', { actual: 'mala', nueva: 'nueva1' })).data.campo).toBe('actual');
    expect((await n.put('/perfil/password', { actual: 'abcd', nueva: 'x' })).data.campo).toBe('nueva');
    expect((await n.put('/perfil/password', { actual: 'abcd', nueva: 'nueva1' })).status).toBe(200);

    const otro = navegador();
    expect((await otro.post('/auth/login', { correo: 'nuevo@gmail.com', password: 'abcd' })).status).toBe(401);
    expect((await otro.post('/auth/login', { correo: 'nuevo@gmail.com', password: 'nueva1' })).status).toBe(200);
    expect((await navegador().put('/perfil', {})).status).toBe(401);
  });

  it('el administrador crea y elimina usuarios, pero no puede eliminarse a sí mismo', async () => {
    const a = navegador();
    const { data } = await a.post('/auth/login', { correo: 'admin@gmail.com', password: 'admin' });

    const creado = await a.post('/usuarios', { nombre: 'Vende Dora', correo: 'vendedora@gmail.com', password: '1234', rol: 'Vendedor' });
    expect(creado.status).toBe(201);
    expect(creado.data).toMatchObject({ rol: 'Vendedor', run: '' });
    expect((await a.post('/usuarios', { nombre: 'X', correo: 'vendedora@gmail.com', password: '1234', rol: 'Vendedor' })).status).toBe(409);
    expect((await a.post('/usuarios', { nombre: 'X', correo: 'x@gmail.com', password: '1234', rol: 'Rey' })).status).toBe(400);
    expect((await a.get('/usuarios')).data.length).toBeGreaterThanOrEqual(6);

    expect((await a.del(`/usuarios/${data.usuario.id}`)).status).toBe(400);
    expect((await a.del(`/usuarios/${creado.data.id}`)).status).toBe(204);
  });
});
