// ===== Funciones genéricas de manejo de errores =====
function mostrarError(idSpan, mensaje) {
  const span = document.getElementById(idSpan);
  if (span) span.textContent = mensaje;
}

function limpiarError(idSpan) {
  const span = document.getElementById(idSpan);
  if (span) span.textContent = "";
}

// ===== Validación de RUN chileno =====
function validarRun(run) {
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

// ===== Validación de correo institucional/permitido =====
function validarCorreo(correo) {
  const dominiosPermitidos = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return dominiosPermitidos.test(correo.trim());
}