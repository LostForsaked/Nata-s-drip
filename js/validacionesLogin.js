

document.getElementById("form-login").addEventListener("submit", function (evento) {
  evento.preventDefault();

  let formularioValido = true;

  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;


  limpiarError("error-correo");
  limpiarError("error-password");

  if (!validarCorreo(correo)) {
    mostrarError("error-correo", "Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com");
    formularioValido = false;
  }

  if (!validarPassword(password)) {
    mostrarError("error-password", "La contraseña debe tener entre 4 y 10 caracteres.");
    formularioValido = false;
  }

  if (formularioValido) {
    const usuario = buscarUsuarioPorCorreo(correo);

    if (!usuario || usuario.password !== password) {
      mostrarError("error-password", "Correo o contraseña incorrectos.");
    } else {

      localStorage.setItem("usuario_sesion", JSON.stringify(usuario));

      alert("¡Bienvenido/a " + usuario.nombre + "! Sesión iniciada correctamente.");


      if (usuario.rol === "Administrador") {
        window.location.href = "Admin/home.html"; // Redirige al panel Admin
      } else {
        window.location.href = "index.html"; // Redirige al inicio/tienda
      }
    }
  }
});


const camposLogin = ["correo", "password"];

camposLogin.forEach(id => {
  const campo = document.getElementById(id);
  if (campo) {
    campo.addEventListener("input", () => {
      limpiarError(`error-${id}`);
    });
  }
});

