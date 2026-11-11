/**
 * Cliente HTTP del backend (Express + MySQL).
 * Todas las rutas empiezan con /api. En desarrollo Vite las redirige al servidor
 * (ver vite.config.js); en producción las sirve el mismo Express.
 * La sesión viaja en una cookie httpOnly: el JavaScript nunca toca el token.
 */
export class ApiError extends Error {
  constructor(status, mensaje, campo) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.campo = campo; // campo del formulario al que corresponde el error (si aplica)
  }
}

export async function api(ruta, { method = 'GET', body } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`/api${ruta}`, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa que esté encendido (npm run server).');
  }

  const texto = await respuesta.text();
  let datos = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, datos?.error || `Error ${respuesta.status}`, datos?.campo);
  }

  // Cualquier cambio en la base avisa a quien esté mostrando datos (p. ej. el carrito del Navbar)
  if (method !== 'GET') window.dispatchEvent(new Event('dbActualizada'));
  return datos;
}
