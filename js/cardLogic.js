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
  localStorage.removeItem('mi_carrito');
  

  actualizarBadgesNavbar();
  
  if (document.getElementById('gridProductosCarrito')) {
    location.reload();
  }
}
