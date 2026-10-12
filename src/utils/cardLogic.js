// src/utils/cardLogic.js
import { productosCatalogo } from './productos';

export function obtenerCarrito() {
  const cartData = localStorage.getItem('mi_carrito');
  if (!cartData) return [];
  
  const carrito = JSON.parse(cartData);
  
  // Filtramos para asegurarnos de que solo existan productos válidos del catálogo
  const carritoValido = carrito.filter(item => {
    return productosCatalogo.some(p => p.id === item.id);
  });

  if (carritoValido.length !== carrito.length) {
    localStorage.setItem('mi_carrito', JSON.stringify(carritoValido));
  }

  return carritoValido;
}

export function agregarAlCarritoGlobal(productoId, cantidad = 1) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === productoId);

  if (index !== -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({ id: productoId, cantidad: cantidad });
  }

  localStorage.setItem('mi_carrito', JSON.stringify(carrito));
  
  // Disparamos el evento para que el Navbar actualice el número al instante
  window.dispatchEvent(new Event('carritoActualizado'));
}

export function vaciarCarritoGlobal() {
  localStorage.removeItem('mi_carrito');
  window.dispatchEvent(new Event('carritoActualizado'));
}