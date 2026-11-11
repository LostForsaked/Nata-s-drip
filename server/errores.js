export class HttpError extends Error {
  constructor(status, mensaje, campo = undefined) {
    super(mensaje);
    this.status = status;
    this.campo = campo;
  }
}

export const noEncontrado = (mensaje = 'No encontrado.') => new HttpError(404, mensaje);
export const solicitudInvalida = (mensaje, campo) => new HttpError(400, mensaje, campo);
