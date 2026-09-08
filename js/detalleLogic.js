document.addEventListener('DOMContentLoaded', () => {

  // 1. Obtener el ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const idProductoURL = parseInt(urlParams.get('id')) || 1;

  // 2. Buscar el producto en el catálogo
  const prod = productosCatalogo.find(p => p.id === idProductoURL);

  // 3. Renderizar los datos en el HTML si el producto existe
  if (prod) {
    const elTitulo = document.getElementById('productTitle');
    const elBreadcrumb = document.getElementById('productTitleBreadcrumb');
    const elPrecio = document.getElementById('productPrice');
    const elDesc = document.getElementById('productDescription');
    const elImg = document.getElementById('mainProductImg');

    if (elTitulo) elTitulo.textContent = prod.titulo;
    if (elBreadcrumb) elBreadcrumb.textContent = prod.titulo;
    if (elPrecio) elPrecio.textContent = `$${prod.precio}`;
    if (elDesc) elDesc.textContent = prod.descripcion || "Descripción no disponible.";
    
    // Asignar la imagen dinámica aquí
    if (elImg) {
      elImg.src = prod.img;
      elImg.alt = prod.titulo;
    }
  }

  // 4. Lógica para el botón de agregar al carrito
  const btnAddToCart = document.getElementById('addToCartBtn');
  const qtySelect = document.getElementById('quantitySelect');

  if (btnAddToCart && qtySelect) {
    btnAddToCart.addEventListener('click', () => {
      const cantidad = parseInt(qtySelect.value) || 1;
      agregarAlCarritoGlobal(idProductoURL, cantidad);
    });
  }
});