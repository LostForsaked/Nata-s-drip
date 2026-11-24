import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import Pendiente from '../pages/admin/Pendiente';
import { instalarApiFalsa, USUARIOS } from './apiFalsa';

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
  ['Admin: editar usuario', '/admin/usuarios/4/editar'],
  ['Admin: reportes', '/admin/reportes'],
  ['Página no encontrada', '/ruta-inexistente'],
];

beforeEach(() => {
  // Sesión de administrador y datos de ejemplo servidos por una API falsa (sin MySQL)
  instalarApiFalsa({ usuario: USUARIOS.admin });
  window.history.replaceState({}, '', '/');
  window.scrollTo = () => {};
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Smoke tests de las páginas', () => {
  // Los datos llegan de la API, así que se espera a que termine de cargar
  it.each(PAGINAS)('renderiza %s en %s', async (_nombre, ruta) => {
    window.history.replaceState({}, '', ruta);
    const { container } = render(<App />);

    await waitFor(() => {
      expect(container.querySelector('h1, h2, h3, h4, h5, h6, legend')).not.toBeNull();
    });
    expect(container.textContent.trim()).not.toBe('');
  });

  it('redirige al login si alguien sin sesión intenta abrir el panel de administración', async () => {
    instalarApiFalsa({ usuario: null });
    window.history.replaceState({}, '', '/admin/productos');
    render(<App />);

    await waitFor(() => expect(window.location.pathname).toBe('/login'));
  });

  it('no deja entrar al panel a un cliente', async () => {
    instalarApiFalsa({ usuario: USUARIOS.cliente });
    window.history.replaceState({}, '', '/admin');
    render(<App />);

    await waitFor(() => expect(window.location.pathname).toBe('/'));
  });

  it('permite que un cliente abra su perfil desde el menú de cuenta', async () => {
    instalarApiFalsa({ usuario: USUARIOS.cliente });
    window.history.replaceState({}, '', '/perfil');

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Mi perfil' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Mis datos' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Mi perfil' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Actualizar contraseña' })).toBeTruthy();
  });

  it('muestra en crear usuario todos los campos que exige la API', async () => {
    window.history.replaceState({}, '', '/admin/usuarios/nuevo');
    render(<App />);

    for (const label of ['RUN', 'Nombre', 'Apellidos', 'Correo Electrónico', 'Contraseña', 'Dirección', 'Región', 'Comuna', 'Rol de Usuario']) {
      expect(await screen.findByLabelText(new RegExp(label))).toBeTruthy();
    }

    fireEvent.submit(screen.getByRole('button', { name: 'Guardar Usuario' }).closest('form'));
    expect(await screen.findByText('Ingresa un RUN válido. Ej: 19011022K.')).toBeTruthy();
    expect(screen.getByText('La dirección es obligatoria.')).toBeTruthy();
  });

  it('permite editar datos de usuario y dejar vacía la contraseña para conservarla', async () => {
    window.history.replaceState({}, '', '/admin/usuarios/4/editar');
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Editar Usuario' })).toBeTruthy();
    expect(screen.getByLabelText('Nombre').value).toBe('Cliente');
    expect(screen.getByLabelText('Apellidos').value).toBe('Demo');
    expect(screen.getByLabelText(/Contraseña/).value).toBe('');
    expect(screen.getByText('Déjala vacía para conservar la contraseña actual.')).toBeTruthy();
  });

  it('renderiza la vista Pendiente, que no está conectada a una ruta', () => {
    render(<Pendiente titulo="Vista pendiente" />);

    expect(screen.getByRole('heading', { name: 'Vista pendiente' })).toBeTruthy();
  });
});
