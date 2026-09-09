function obtenerUsuarios() {
  const usuarios = localStorage.getItem("tienda_usuarios");
  if (!usuarios) {
    const usuariosIniciales = [
    { id: 1, nombre: "Admin Nata", correo: "admin@gmail.com", password: "admin", rol: "Administrador" },
    { id: 2, nombre: "Admin Ruben", correo: "admin2@gmail.com", password: "admin", rol: "Administrador" },
    { id: 3, nombre: "Cliente Demo", correo: "cliente@gmail.com", password: "1234", rol: "Cliente" }
    ];
    localStorage.setItem("tienda_usuarios", JSON.stringify(usuariosIniciales));
    return usuariosIniciales;
  }
  return JSON.parse(usuarios);
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("tienda_usuarios", JSON.stringify(usuarios));
}

function renderizarTablaUsuarios() {
  const tbody = document.getElementById("tabla-usuarios-body");
  const mensajeVacio = document.getElementById("mensaje-vacio-usuarios");

  if (!tbody) return;

  const usuarios = obtenerUsuarios();
  tbody.innerHTML = "";

  if (usuarios.length === 0) {
    if (mensajeVacio) mensajeVacio.style.display = "block";
    return;
  }

  if (mensajeVacio) mensajeVacio.style.display = "none";

  usuarios.forEach(usuario => {
    const fila = document.createElement("tr");

    const badgeRol = usuario.rol === "Administrador" 
      ? '<span class="badge bg-danger">Administrador</span>' 
      : '<span class="badge bg-secondary">Cliente</span>';

    fila.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.email}</td>
      <td>${badgeRol}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger btn-eliminar-usuario" data-id="${usuario.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });


  document.querySelectorAll(".btn-eliminar-usuario").forEach(boton => {
    boton.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        eliminarUsuario(id);
        renderizarTablaUsuarios();
      }
    });
  });
}

function eliminarUsuario(id) {
  let usuarios = obtenerUsuarios();
  usuarios = usuarios.filter(u => u.id !== id);
  guardarUsuarios(usuarios);
}


const formNuevoUsuario = document.getElementById("form-nuevo-usuario");
if (formNuevoUsuario) {
  formNuevoUsuario.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuarios = obtenerUsuarios();
    const nuevoUsuario = {
      id: Date.now(),
      nombre: document.getElementById("nombreUsuario").value.trim(),
      email: document.getElementById("emailUsuario").value.trim(),
      password: document.getElementById("passwordUsuario").value,
      rol: document.getElementById("rolUsuario").value
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    alert("¡Usuario registrado con éxito!");
    window.location.href = "usuarios-listado.html";
  });
}


document.addEventListener("DOMContentLoaded", () => {
  renderizarTablaUsuarios();
});
