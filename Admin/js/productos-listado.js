//  Renderizar tabla de productos 
function renderizarTablaProductos() {
  const productos = obtenerProductos();
  const tbody = document.getElementById("tabla-productos-body");
  const mensajeVacio = document.getElementById("mensaje-vacio");

  tbody.innerHTML = "";

  if (productos.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  }

  mensajeVacio.style.display = "none";

  productos.forEach(producto => {
    const fila = document.createElement("tr");
    const stockBajo = producto.stockCritico !== "" && parseInt(producto.stock) <= parseInt(producto.stockCritico);

    fila.innerHTML = `
      <td>${producto.codigo}</td>
      <td>${producto.nombre}</td>
      <td>$${parseFloat(producto.precio).toLocaleString("es-CL")}</td>
      <td>${producto.stock} ${stockBajo ? '<span class="badge badge-stock-critico ms-1">Stock bajo</span>' : ''}</td>
      <td>${producto.categoria}</td>
      <td class="text-end">
        <a href="productos-editar.html?codigo=${producto.codigo}" class="btn btn-sm btn-outline-primary me-1">
          <i class="bi bi-pencil"></i>
        </a>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-codigo="${producto.codigo}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(fila);
  });

  document.querySelectorAll(".btn-eliminar").forEach(boton => {
    boton.addEventListener("click", function () {
      const codigo = this.getAttribute("data-codigo");
      if (confirm("¿Seguro que quieres eliminar este producto?")) {
        eliminarProducto(codigo);
        renderizarTablaProductos();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  sembrarProductosIniciales();
  renderizarTablaProductos();
});