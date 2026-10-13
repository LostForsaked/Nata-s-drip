import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from '../App';
import {
  crearOrden,
  iniciarDB,
  iniciarSesion,
  obtenerUsuarios,
} from '../data/db';
import Pendiente from '../pages/admin/Pendiente';

const PAGINAS = [
  ['Inicio', '/'],
  ['Productos', '/productos'],
  ['Categorías', '/categorias'],
  ['Ofertas', '/ofertas'],
  ['Detalle de producto', '/detalles?id=1'],
  ['Carrito', '/carrito'],
  ['Checkout', '/checkout'],
  ['Compra exitosa', '/compra-exitosa?orden=1'],
  ['Compra fallida', '/compra-fallida?orden=2'],
  ['Blogs', '/blogs'],
  ['Detalle de blog', '/blogs/1'],
  ['Contacto', '/contacto'],
  ['Inicio de sesión', '/login'],
  ['Registro', '/registro'],
  ['Nosotros', '/nosotros'],
  ['Admin: dashboard', '/admin'],
  ['Admin: productos', '/admin/productos'],
  ['Admin: productos críticos', '/admin/productos/criticos'],
  ['Admin: detalle de producto', '/admin/productos/1'],
  ['Admin: órdenes', '/admin/ordenes'],
  ['Admin: boleta', '/admin/ordenes/1'],
  ['Admin: perfil', '/admin/perfil'],
  ['Admin: crear producto', '/admin/productos/nuevo'],
  ['Admin: editar producto', '/admin/productos/1/editar'],
  ['Admin: categorías', '/admin/categorias'],
  ['Admin: usuarios', '/admin/usuarios'],
  ['Admin: nuevo usuario', '/admin/usuarios/nuevo'],
  ['Admin: reportes', '/admin/reportes'],
  ['Página no encontrada', '/ruta-inexistente'],
];

function crearOrdenDePrueba(estado) {
  return crearOrden({
    estado,
    cliente: {
      nombre: 'Cliente',
      apellidos: 'De prueba',
      correo: 'cliente@gmail.com',
    },
    direccion: {
      calle: 'Calle de prueba 123',
      departamento: '',
      region: 'Región Metropolitana de Santiago',
      comuna: 'Santiago',
      indicaciones: '',
    },
    items: [
      {
        productoId: 1,
        nombre: 'Afraid of Women',
        imagen: '/img/poleraLobo.avif',
        precioUnitario: 14990,
        cantidad: 1,
        subtotal: 14990,
      },
    ],
    subtotal: 14990,
    descuento: 0,
    total: 14990,
  });
}

beforeEach(() => {
  localStorage.clear();
  iniciarDB();
  iniciarSesion(obtenerUsuarios()[0]);
  crearOrdenDePrueba('Pagada');
  crearOrdenDePrueba('Pago fallido');
  window.history.replaceState({}, '', '/');
  window.scrollTo = () => {};
});

afterEach(() => {
  cleanup();
});

describe('Smoke tests de las páginas', () => {
  it.each(PAGINAS)('renderiza %s en %s', (_nombre, ruta) => {
    window.history.replaceState({}, '', ruta);
    const { container } = render(<App />);

    expect(container.textContent.trim()).not.toBe('');
    expect(container.querySelector('h1, h2, h3, h4, h5, h6, legend')).not.toBeNull();
  });

  it('renderiza la vista Pendiente, que no está conectada a una ruta', () => {
    render(<Pendiente titulo="Vista pendiente" />);

    expect(screen.getByRole('heading', { name: 'Vista pendiente' })).toBeTruthy();
  });
});
