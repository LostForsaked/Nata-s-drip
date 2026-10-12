// src/utils/validaciones.js

// Validar que un campo no esté vacío
export function validarRequerido(valor) {
  return valor !== null && valor !== undefined && valor.trim() !== "";
}

// Validar que el precio sea un número válido y mayor a 0
export function validarPrecio(precio) {
  const numero = parseFloat(precio);
  return !isNaN(numero) && numero > 0;
}

// Validar stock (número entero mayor o igual a 0)
export function validarStock(stock) {
  const numero = parseInt(stock, 10);
  return !isNaN(numero) && numero >= 0;
}

// Validar formato de email básico (mantenido por compatibilidad)
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Funciones genéricas de manejo de errores 
export function mostrarError(idSpan, setErrores) {
  // En React manejamos errores con el estado, pero dejamos la estructura lista
}

// Validación de RUN chileno 
export function validarRun(run) {
  run = run.trim().toUpperCase().replace(/[.\-]/g, "");
  if (run.length < 7 || run.length > 9) return false;
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  let dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

// Validación de correo institucional/permitido 
export function validarCorreo(correo) {
  const dominiosPermitidos = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return dominiosPermitidos.test(correo.trim());
}

export function validarPassword(password) {
  return password.length >= 4 && password.length <= 10;
}

export function validarNombreContacto(nombre) {
  return nombre.trim().length > 0 && nombre.trim().length <= 100;
}

export function validarComentario(comentario) {
  return comentario.trim().length > 0 && comentario.trim().length <= 500;
}

export function obtenerUsuarios() {
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

export function guardarUsuarios(usuario) {
  const usuarios = obtenerUsuarios();
  usuarios.push(usuario);
  localStorage.setItem("tienda_usuarios", JSON.stringify(usuarios));
}

export function buscarUsuarioPorCorreo(correo) {
  const usuarios = obtenerUsuarios();
  return usuarios.find(u => u.correo && u.correo.toLowerCase() === correo.toLowerCase().trim());
}