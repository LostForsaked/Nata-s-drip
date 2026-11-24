
const CLAVE_TOKEN = 'nd_token';

export const leerToken = () => localStorage.getItem(CLAVE_TOKEN);
export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token);
export const quitarToken = () => localStorage.removeItem(CLAVE_TOKEN);

export class ApiError extends Error {
  constructor(status, mensaje, campo) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.campo = campo; 
  }
}

export async function api(ruta, { method = 'GET', body } = {}) {
  const token = leerToken();
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`/api/v1${ruta}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
  }

  const texto = await respuesta.text();
  let datos = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    
    if (respuesta.status === 401 && token) {
      quitarToken();
      window.dispatchEvent(new Event('sesionActualizada'));
    }
    
    const [clave, mensajeCampo] = Object.entries(datos?.campos ?? {})[0] ?? [];
    const mensaje =
      mensajeCampo ||
      datos?.mensaje ||
      (respuesta.status === 401
        ? 'Debes iniciar sesión.'
        : respuesta.status === 403
          ? 'No tienes permiso para realizar esta acción.'
          : `Error ${respuesta.status}`);
    throw new ApiError(respuesta.status, mensaje, clave ? clave.split('.').pop() : undefined);
  }


  if (method !== 'GET') window.dispatchEvent(new Event('dbActualizada'));
  return datos;
}