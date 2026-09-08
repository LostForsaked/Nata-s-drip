let cuponAplicado = false;

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrito();

  // Evento para aplicar cupón
  const btnCupon = document.getElementById('btnCupon');
  if (btnCupon) {
    btnCupon.addEventListener('click', aplicarCupon);
  }

  // Evento para vaciar carrito
  const btnVaciar = document.getElementById('btnVaciar');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
      vaciarCarritoGlobal();
      renderizarCarrito();
    });
  }
});

function renderizarCarrito() {
  const contenedor = document.getElementById('contenedorCarrito');
  if (!contenedor) return;

  const carrito = obtenerCarrito(); // Función heredada de cardLogic.js

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="card border-0 shadow-sm rounded-4 p-5 text-center">
        <i class="bi bi-cart-x fs-1 text-muted mb-3"></i>
        <h4>Tu carrito está vacío</h4>
        <p class="text-secondary">¿Aún no te decides? Revisa nuestro catálogo.</p>
        <div>
          <a href="Productos.html" class="btn btn-primary rounded-pill px-4">Ir a la Tienda</a>
        </div>
      </div>
    `;
    actualizarResumen(0);
    return;
  }

  contenedor.innerHTML = '';
  let subtotal = 0;

  carrito.forEach(item => {
    const producto = productosCatalogo.find(p => p.id === item.id);
    if (!producto) return;

    const totalItem = producto.precio * item.cantidad;
    subtotal += totalItem;

    const tarjeta = document.createElement('div');
    tarjeta.className = 'card border-0 shadow-sm rounded-4 mb-3 p-3';
    tarjeta.innerHTML = `
      <div class="row align-items-center g-3">
        <div class="col-3 col-sm-2 text-center">
          <img src="${producto.img}" class="img-fluid rounded-3 object-fit-cover" style="max-height: 80px;" alt="${producto.titulo}">
        </div>
        <div class="col-9 col-sm-4">
          <h6 class="fw-bold text-dark mb-1">${producto.titulo}</h6>
          <span class="text-muted small">$${producto.precio.toLocaleString()} c/u</span>
        </div>
        <div class="col-6 col-sm-3 d-flex align-items-center justify-content-center">
          <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
          <span class="fw-bold mx-3">${item.cantidad}</span>
          <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
        </div>
        <div class="col-6 col-sm-3 text-end fw-bold fs-5 text-primary">
          $${totalItem.toLocaleString()}
          <button class="btn btn-link text-danger p-0 ms-2" onclick="eliminarProducto(${producto.id})">
            <i class="bi bi-x-circle fs-5"></i>
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });

  actualizarResumen(subtotal);
}


function cambiarCantidad(productoId, delta) {
  let carrito = obtenerCarrito();
  const item = carrito.find(p => p.id === productoId);

  if (item) {
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      carrito = carrito.filter(p => p.id !== productoId);
    }
  }

  localStorage.setItem('mi_carrito', JSON.stringify(carrito));
  actualizarBadgesNavbar();
  renderizarCarrito();
}


function eliminarProducto(productoId) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(p => p.id !== productoId);
  localStorage.setItem('mi_carrito', JSON.stringify(carrito));
  actualizarBadgesNavbar();
  renderizarCarrito();
}


function aplicarCupon() {
  const input = document.getElementById('inputCupon').value.trim().toUpperCase();
  const mensaje = document.getElementById('mensajeCupon');

  if (input === 'NATAS10') {
    cuponAplicado = true;
    mensaje.className = 'd-block mt-1 text-success small fw-semibold';
    mensaje.textContent = '¡Cupón del 10% aplicado!';
  } else {
    cuponAplicado = false;
    mensaje.className = 'd-block mt-1 text-danger small';
    mensaje.textContent = 'Cupón inválido';
  }
  renderizarCarrito();
}

function actualizarResumen(subtotal) {
  let descuento = 0;
  if (cuponAplicado) {
    descuento = subtotal * 0.10;
    document.getElementById('filaDescuento').classList.remove('d-none');
  } else {
    document.getElementById('filaDescuento').classList.add('d-none');
  }

  const total = subtotal - descuento;

  document.getElementById('resumenSubtotal').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('resumenDescuento').textContent = `-$${descuento.toLocaleString()}`;
  document.getElementById('resumenTotal').textContent = `$${total.toLocaleString()}`;
}