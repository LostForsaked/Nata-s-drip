export default function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border" aria-hidden="true"></div>
      <p className="mt-3 mb-0">{texto}</p>
    </div>
  );
}

export function ErrorCarga({ error, onReintentar }) {
  return (
    <div className="container my-5">
      <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
        <span>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error?.message || 'No se pudieron cargar los datos.'}
        </span>
        {onReintentar && (
          <button type="button" className="btn btn-sm btn-outline-light" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
