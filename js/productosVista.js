
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gridProductos');
  if (!grid) return;

  grid.innerHTML = '';

  productosCatalogo.forEach(prod => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 border-0 shadow-sm text-center p-3 rounded-4">
        <!-- Clic en la imagen lleva al detalle con el ID del producto -->
        <a href="Detalles.html?id=${prod.id}" class="text-decoration-none">
          <img src="${prod.img}" class="card-img-top rounded-3 mb-3 object-fit-cover" style="height: 180px;" alt="${prod.titulo}">
          <h6 class="card-title fw-semibold text-dark mb-1">${prod.titulo}</h6>
        </a>
        <p class="card-text fw-bold text-primary mb-3">$${prod.precio}</p>
        
        <!-- Botón Añadir directo desde la lista -->
        <button class="btn btn-outline-primary rounded-3 w-100 py-2 fw-semibold" onclick="agregarAlCarritoGlobal(${prod.id}, 1)">
          <i class="bi bi-cart-plus me-1"></i> Añadir
        </button>
      </div>
    `;
    grid.appendChild(col);
  });
});
