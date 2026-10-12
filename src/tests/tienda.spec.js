import { describe, it, expect } from 'vitest';

describe("Pruebas de la tienda Nata's Drip", function () {
  it("calcula correctamente el subtotal", function () {
    const productos = [
      { precio: 14990, cantidad: 2 },
      { precio: 9990, cantidad: 1 },
    ];

    const subtotal = productos.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
      0
    );

    expect(subtotal).toBe(39970);
  });

  it("calcula un descuento del 10%", function () {
    const subtotal = 20000;
    const total = subtotal * 0.9;

    expect(total).toBe(18000);
  });

  it("detecta un carrito vacío", function () {
    const carrito = [];

    expect(carrito.length).toBe(0);
  });

  it("genera un número de pedido válido", function () {
    const numeroPedido = `ND-${Date.now()}`;

    expect(numeroPedido.startsWith("ND-")).toBe(true); // <--- Actualizado a toBe(true)
  });
});