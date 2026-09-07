document.addEventListener('DOMContentLoaded', () => {
  actualizarBadgesNavbar();
});

function obtenerCarrito() {
  const cartData = localStorage.getItem('mi_carrito');
  return cartData ? JSON.parse(cartData) : [];
}

function agregarAlCarritoGlobal(productoId, cantidad = 1) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === productoId);

  if (index !== -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({ id: productoId, cantidad: cantidad });
  }

  localStorage.setItem('mi_carrito', JSON.stringify(carrito));
  actualizarBadgesNavbar();
}

function actualizarBadgesNavbar() {
  const carrito = obtenerCarrito();
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const badgeNav = document.getElementById('cartCountNav');
  if (badgeNav) {
    badgeNav.textContent = totalCantidad;
  }
}

function vaciarCarritoGlobal() {
  // Eliminar los datos guardados
  localStorage.removeItem('mi_carrito');
  
  // Actualizar el número del navbar a 0
  actualizarBadgesNavbar();
  
  // Opcional: si estás en la página del carrito, puedes recargar para limpiar la vista
  if (document.getElementById('gridProductosCarrito')) {
    location.reload();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Limpia el carrito del almacenamiento local en cuanto recargas la página
  localStorage.removeItem('mi_carrito');
  
  // Actualiza el contador del navbar para que marque 0
  actualizarBadgesNavbar();
});