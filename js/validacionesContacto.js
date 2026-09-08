// Validaciones de contacto
function validarNombreContacto(nombre) {
  return nombre.trim().length > 0 && nombre.trim().length <= 100;
}

function validarComentario(comentario) {
  return comentario.trim().length > 0 && comentario.trim().length <= 500;
}

//Envío del formulario de contacto
document.getElementById("form-contacto").addEventListener("submit", function (evento) {
  evento.preventDefault();

  let formularioValido = true;

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const comentario = document.getElementById("comentario").value;

  // Limpiar errores
  ["nombre", "correo", "comentario"].forEach(id => limpiarError(`error-${id}`));

  if (!validarNombreContacto(nombre)) {
    mostrarError("error-nombre", "El nombre es obligatorio (máx. 100 caracteres).");
    formularioValido = false;
  }

  // 
  if (correo.trim() !== "" && !validarCorreo(correo)) {
    mostrarError("error-correo", "Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com");
    formularioValido = false;
  }

  if (!validarComentario(comentario)) {
    mostrarError("error-comentario", "El comentario es obligatorio (máx. 500 caracteres).");
    formularioValido = false;
  }

  if (formularioValido) {
    alert("¡Gracias " + nombre + "! Tu mensaje fue enviado.");
    document.getElementById("form-contacto").reset();
  }
});

// Limpiar errores mientras el usuario escribe
const camposContacto = ["nombre", "correo", "comentario"];

camposContacto.forEach(id => {
  const campo = document.getElementById(id);
  campo.addEventListener("input", () => {
    limpiarError(`error-${id}`);
  });
});