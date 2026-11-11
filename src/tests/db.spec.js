import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  obtenerProductos, buscarProductoPorId, crearProducto, eliminarProducto,
  obtenerCategorias, eliminarCategoria,
  iniciarSesion, cerrarSesion, obtenerSesion, actualizarPerfil,
  registrarUsuario, buscarOrdenPorId,
  esOferta, precioFinal, nombreCategoria,
} from '../data/db';
import { api, ApiError } from '../data/api';
import {
  agregarAlCarritoGlobal, cambiarCantidadCarrito, aplicarCupon, calcularTotales,
} from '../utils/cardLogic';
import { aprobarPago } from '../utils/pagos';
import { resumenVentas, ventasPorProducto, ventasPorCategoria } from '../utils/reportes';
import { instalarApiFalsa, USUARIOS } from './apiFalsa';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Cliente de la API (reemplaza al localStorage por MySQL)", () => {
  it('lee productos y categorías haciendo GET a /api', async () => {
    const { llamadas } = instalarApiFalsa();

    expect((await obtenerProductos()).length).toBe(3);
    expect((await obtenerCategorias()).map((c) => c.nombre)).toEqual(['Memes', 'Bandas']);
    expect(llamadas.map((l) => `${l.metodo} ${l.ruta}`)).toEqual(['GET /productos', 'GET /categorias']);
  });

  it('buscarProductoPorId devuelve el producto o null si no existe', async () => {
    instalarApiFalsa();

    expect((await buscarProductoPorId(2)).nombre).toBe('Producto 2');
    expect(await buscarProductoPorId(999)).toBeNull();
  });

  it('envía los datos al crear y eliminar productos', async () => {
    const { llamadas } = instalarApiFalsa();

    await crearProducto({ codigo: 'X1', nombre: 'Nuevo' });
    await eliminarProducto(7);

    expect(llamadas[0]).toEqual({ metodo: 'POST', ruta: '/productos', cuerpo: { codigo: 'X1', nombre: 'Nuevo' } });
    expect(llamadas[1]).toMatchObject({ metodo: 'DELETE', ruta: '/productos/7' });
  });

  it('eliminarCategoria devuelve false si la categoría tiene productos (409) y true si no', async () => {
    instalarApiFalsa();

    expect(await eliminarCategoria(1)).toBe(false);
    expect(await eliminarCategoria(2)).toBe(true);
  });

  it('inicia y cierra sesión, y avisa a la interfaz', async () => {
    instalarApiFalsa({ usuario: null });
    const aviso = vi.fn();
    window.addEventListener('sesionActualizada', aviso);

    expect(await obtenerSesion()).toBeNull();
    const usuario = await iniciarSesion('admin@gmail.com', 'admin');
    expect(usuario.rol).toBe('Administrador');
    expect(await obtenerSesion()).toMatchObject({ correo: 'admin@gmail.com' });

    await cerrarSesion();
    expect(await obtenerSesion()).toBeNull();
    expect(aviso).toHaveBeenCalledTimes(2);
    window.removeEventListener('sesionActualizada', aviso);
  });

  it('una contraseña incorrecta lanza ApiError con el campo del formulario', async () => {
    instalarApiFalsa({ usuario: null });

    await expect(iniciarSesion('admin@gmail.com', 'mala')).rejects.toMatchObject({
      name: 'ApiError', status: 401, campo: 'password', message: 'Correo o contraseña incorrectos.',
    });
  });

  it('el registro devuelve el usuario creado y propaga el error de correo repetido', async () => {
    instalarApiFalsa({ usuario: null });

    const nuevo = await registrarUsuario({ correo: 'nuevo@gmail.com', nombre: 'Nuevo' });
    expect(nuevo.correo).toBe('nuevo@gmail.com');
    await expect(registrarUsuario({ correo: 'admin@gmail.com' })).rejects.toMatchObject({ status: 409, campo: 'correo' });
  });

  it('actualiza el perfil y devuelve el usuario actualizado', async () => {
    instalarApiFalsa({ usuario: USUARIOS.cliente });

    const usuario = await actualizarPerfil({ nombre: 'Otro' });
    expect(usuario.nombre).toBe('Otro');
  });

  it('buscarOrdenPorId devuelve null cuando la orden no existe', async () => {
    instalarApiFalsa();

    expect((await buscarOrdenPorId(1)).estado).toBe('Pagada');
    expect(await buscarOrdenPorId(99)).toBeNull();
  });

  it('solo las operaciones que modifican datos emiten "dbActualizada"', async () => {
    instalarApiFalsa();
    const aviso = vi.fn();
    window.addEventListener('dbActualizada', aviso);

    await obtenerProductos();
    expect(aviso).not.toHaveBeenCalled();

    await eliminarProducto(1);
    expect(aviso).toHaveBeenCalledTimes(1);
    window.removeEventListener('dbActualizada', aviso);
  });

  it('muestra un mensaje claro si el servidor no responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const error = await api('/productos').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
    expect(error.message).toMatch(/No se pudo conectar con el servidor/);
  });
});

describe('Carrito y pagos (guardados en MySQL)', () => {
  it('agrega al carrito, cambia cantidades y aplica un cupón', async () => {
    const { llamadas } = instalarApiFalsa();

    expect(await agregarAlCarritoGlobal(3, 2)).toEqual({ ok: true, limitadoPorStock: false });
    await cambiarCantidadCarrito(3, -1);
    await aplicarCupon('NATAS10');

    expect(llamadas[0]).toEqual({ metodo: 'POST', ruta: '/carrito/items', cuerpo: { productoId: 3, cantidad: 2 } });
    expect(llamadas[1]).toEqual({ metodo: 'PATCH', ruta: '/carrito/items/3', cuerpo: { delta: -1 } });
    expect(llamadas[2]).toEqual({ metodo: 'PUT', ruta: '/carrito/cupon', cuerpo: { codigo: 'NATAS10' } });
  });

  it('calcula subtotal, descuento del cupón y total', () => {
    const items = [{ subtotal: 20000 }, { subtotal: 10000 }];

    expect(calcularTotales(items)).toEqual({ subtotal: 30000, descuento: 0, total: 30000 });
    expect(calcularTotales(items, { codigo: 'NATAS10', porcentaje: 10 })).toEqual({
      subtotal: 30000, descuento: 3000, total: 27000,
    });
  });

  it('aprobarPago devuelve { ok: true } o el motivo del rechazo', async () => {
    instalarApiFalsa();
    expect(await aprobarPago(1)).toEqual({ ok: true });

    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(JSON.stringify({ error: 'solo quedan 1 unidades de "X" (pediste 3).' }), { status: 409 })
    ));
    expect(await aprobarPago(1)).toEqual({ ok: false, error: 'solo quedan 1 unidades de "X" (pediste 3).' });
  });
});

describe('Funciones de apoyo', () => {
  it('detecta ofertas y calcula el precio final redondeado', () => {
    expect(esOferta({ descuento: 20 })).toBe(true);
    expect(esOferta({ descuento: 0 })).toBe(false);
    expect(precioFinal({ precio: 14990, descuento: 20 })).toBe(11992);
    expect(precioFinal({ precio: 14990, descuento: 0 })).toBe(14990);
  });

  it('busca el nombre de una categoría en la lista cargada', () => {
    const categorias = [{ id: 1, nombre: 'Memes' }];
    expect(nombreCategoria('1', categorias)).toBe('Memes');
    expect(nombreCategoria(9, categorias)).toBe('Sin categoría');
  });
});

describe('Reportes de ventas', () => {
  const ordenes = [
    { estado: 'Pagada', total: 12000, items: [{ productoId: 1, nombre: 'Polera', cantidad: 2, subtotal: 12000 }] },
    { estado: 'Pago fallido', total: 5000, items: [] },
    { estado: 'pendiente de pago', total: 3000, items: [] },
  ];

  it('suma solamente las ventas pagadas', () => {
    const resultado = resumenVentas(ordenes);

    expect(resultado.cantidadPagadas).toBe(1);
    expect(resultado.totalVendido).toBe(12000);
    expect(resultado.fallidas).toBe(1);
    expect(resultado.pendientes).toBe(1);
  });

  it('calcula las unidades e ingresos por producto', () => {
    const resultado = ventasPorProducto(ordenes);

    expect(resultado[0].productoId).toBe(1);
    expect(resultado[0].unidades).toBe(2);
    expect(resultado[0].ingresos).toBe(12000);
  });

  it('agrupa por nombre los productos que ya fueron eliminados (productoId null)', () => {
    const resultado = ventasPorProducto([
      { estado: 'Pagada', total: 3, items: [
        { productoId: null, nombre: 'Vieja A', cantidad: 1, subtotal: 1000 },
        { productoId: null, nombre: 'Vieja B', cantidad: 1, subtotal: 2000 },
      ] },
    ]);

    expect(resultado.map((r) => r.nombre).sort()).toEqual(['Vieja A', 'Vieja B']);
  });

  it('agrupa los ingresos por categoría', () => {
    expect(ventasPorCategoria(ordenes, () => 'Memes')).toEqual([{ categoria: 'Memes', ingresos: 12000 }]);
  });
});
