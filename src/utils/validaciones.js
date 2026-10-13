
// Validar que un campo no esté vacío
export function validarRequerido(valor) {
  return valor !== null && valor !== undefined && valor.trim() !== "";
}

// Validar que el precio sea un número válido y mayor a 0
export function validarPrecio(precio) {
  if (String(precio).trim() == "") return false;
  const numero = Number(precio);
  return !isNaN(numero) && numero >= 0;
}

// Validar stock (número entero mayor o igual a 0)
export function validarStock(stock) {
  if (String(stock).trim() === "") return false;
  const numero = Number(stock);
  return Number.isInteger(numero) && numero >= 0;
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

export { obtenerUsuarios, buscarUsuarioPorCorreo, crearUsuario as guardarUsuarios } from "../data/db"

export const reglasEnvio = {
  nombre: (v) =>
    !validarRequerido(v) ? "El nombre es obligatorio." : v.trim().length > 50 ? "Máximo 50 caracteres." : "",
  apellidos: (v) =>
    !validarRequerido(v) ? "Los apellidos son obligatorios." : v.trim().length > 100 ? "Máximo 100 caracteres." : "",
  correo: (v) =>
    !validarRequerido(v)
      ? "El correo es obligatorio."
      : v.trim().length > 100
        ? "Máximo 100 caracteres."
        : !validarCorreo(v)
          ? "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com."
          : "",
  calle: (v) =>
    !validarRequerido(v) ? "La calle es obligatoria." : v.trim().length > 300 ? "Máximo 300 caracteres." : "",
  departamento: (v) => (v.trim().length > 20 ? "Máximo 20 caracteres." : ""),
  region: (v) => (v ? "" : "Selecciona una región."),
  comuna: (v) => (v ? "" : "Selecciona una comuna."),
  indicaciones: (v) => (v.trim().length > 300 ? "Máximo 300 caracteres." : ""),
};

export function validarEnvio(datos) {
  const errores = {};
  for (const campo of Object.keys(reglasEnvio)) {
    errores[campo] = reglasEnvio[campo](datos[campo] ?? "");
  }
  return errores;
}