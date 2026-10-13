import { beforeEach, describe, expect, it, vi } from 'vitest';

function prepararNavegador() {
  localStorage.clear();

  vi.spyOn(window, 'dispatchEvent');
}

beforeEach(() => {
  vi.restoreAllMocks();
  prepararNavegador();
});

import {
  iniciarDB,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  buscarUsuarioPorCorreo,
} from '../data/db';

import {
  resumenVentas,
  ventasPorProducto,
  ventasPorCategoria,
} from '../utils/reportes';

// Utiliza el localStorage proporcionado por Vitest/jsdom.
function prepararNavegador() {
  localStorage.clear();
}

describe("Pruebas de Nata's Drip", () => {
  beforeEach(() => {
    prepararNavegador();
    iniciarDB();
  });

  describe('Productos CRUD', () => {
    it('carga los productos iniciales', () => {
      expect(obtenerProductos().length).toBeGreaterThan(0);
    });

    it('crea un producto', () => {
      const producto = crearProducto({
        codigo: 'TEST-001',
        nombre: 'Polera de prueba',
        precio: 10000,
        stock: 5,
        categoriaId: 1,
        descuento: 0,
      });

      expect(
        obtenerProductos().some((p) => p.id === producto.id)
      ).toBe(true);
    });

    it('actualiza un producto', () => {
      const producto = crearProducto({
        codigo: 'TEST-002',
        nombre: 'Polera original',
        precio: 10000,
        stock: 5,
        categoriaId: 1,
      });

      actualizarProducto(producto.id, {
        nombre: 'Polera modificada',
      });

      expect(
        obtenerProductos().find((p) => p.id === producto.id).nombre
      ).toBe('Polera modificada');
    });

    it('elimina un producto', () => {
      const producto = crearProducto({
        codigo: 'TEST-003',
        nombre: 'Producto temporal',
        precio: 5000,
        stock: 2,
        categoriaId: 1,
      });

      eliminarProducto(producto.id);

      expect(
        obtenerProductos().some((p) => p.id === producto.id)
      ).toBe(false);
    });
  });

  describe('Categorías CRUD', () => {
    it('carga las categorías iniciales', () => {
      expect(obtenerCategorias().length).toBeGreaterThan(0);
    });

    it('crea una categoría y elimina espacios del nombre', () => {
      const categoria = crearCategoria('  Pruebas  ');

      expect(
        obtenerCategorias().find((c) => c.id === categoria.id).nombre
      ).toBe('Pruebas');
    });

    it('actualiza una categoría', () => {
      const categoria = crearCategoria('Categoría antigua');

      actualizarCategoria(categoria.id, 'Categoría nueva');

      expect(
        obtenerCategorias().find((c) => c.id === categoria.id).nombre
      ).toBe('Categoría nueva');
    });

    it('no elimina una categoría que tiene productos', () => {
      const categoria = obtenerCategorias()[0];

      expect(eliminarCategoria(categoria.id)).toBe(false);
    });

    it('elimina una categoría sin productos asociados', () => {
      const categoria = crearCategoria('Categoría temporal');

      expect(eliminarCategoria(categoria.id)).toBe(true);

      expect(
        obtenerCategorias().some((c) => c.id === categoria.id)
      ).toBe(false);
    });
  });

  describe('Usuarios CRUD', () => {
    it('carga los usuarios iniciales', () => {
      expect(obtenerUsuarios().length).toBeGreaterThan(0);
    });

    it('crea un usuario y lo busca por correo', () => {
      const usuario = crearUsuario({
        nombre: 'Usuario',
        apellidos: 'Prueba',
        correo: 'prueba@gmail.com',
        password: '1234',
      });

      expect(
        buscarUsuarioPorCorreo('PRUEBA@gmail.com')?.id
      ).toBe(usuario.id);
    });

    it('actualiza un usuario', () => {
      const usuario = crearUsuario({
        nombre: 'Nombre antiguo',
        correo: 'editar@gmail.com',
      });

      actualizarUsuario(usuario.id, {
        nombre: 'Nombre nuevo',
      });

      expect(
        obtenerUsuarios().find((u) => u.id === usuario.id).nombre
      ).toBe('Nombre nuevo');
    });

    it('elimina un usuario', () => {
      const usuario = crearUsuario({
        nombre: 'Usuario temporal',
        correo: 'temporal@gmail.com',
      });

      eliminarUsuario(usuario.id);

      expect(
        obtenerUsuarios().some((u) => u.id === usuario.id)
      ).toBe(false);
    });
  });

  describe('Reportes de ventas', () => {
    const ordenes = [
      {
        estado: 'Pagada',
        total: 12000,
        items: [
          {
            productoId: 1,
            nombre: 'Polera',
            cantidad: 2,
            subtotal: 12000,
          },
        ],
      },
      {
        estado: 'Pago fallido',
        total: 5000,
        items: [],
      },
      {
        estado: 'pendiente de pago',
        total: 3000,
        items: [],
      },
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

    it('agrupa los ingresos por categoría', () => {
      const resultado = ventasPorCategoria(
        ordenes,
        () => 'Memes'
      );

      expect(resultado).toEqual([
        { categoria: 'Memes', ingresos: 12000 },
      ]);
    });
  });
});