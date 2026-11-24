import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const NotificacionesContext = createContext(null);

const ESTILOS = {
  success: { titulo: 'Listo', icono: 'bi-check-circle-fill', color: '#198754' },
  danger: { titulo: 'No se pudo completar', icono: 'bi-exclamation-triangle-fill', color: '#b02a37' },
  info: { titulo: 'Información', icono: 'bi-info-circle-fill', color: '#0d6efd' },
};

function Notificacion({ id, mensaje, tipo, onDescartar }) {
  const estilo = ESTILOS[tipo];

  useEffect(() => {
    const timeout = window.setTimeout(() => onDescartar(id), 5000);
    return () => window.clearTimeout(timeout);
  }, [id, onDescartar]);

  return (
    <div
      className="toast show"
      role={tipo === 'danger' ? 'alert' : 'status'}
      aria-live={tipo === 'danger' ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={{
        backgroundColor: '#211113',
        border: `1px solid ${estilo.color}`,
        color: '#fff5ee',
      }}
    >
      <div className="d-flex align-items-center px-3 py-2 border-bottom">
        <i className={`bi ${estilo.icono} me-2`} style={{ color: estilo.color }} aria-hidden="true" />
        <strong className="me-auto">{estilo.titulo}</strong>
        <button
          type="button"
          className="btn-close btn-close-white ms-2"
          aria-label="Cerrar notificación"
          onClick={() => onDescartar(id)}
        />
      </div>
      <div className="toast-body">{mensaje}</div>
    </div>
  );
}

export function NotificacionesProvider({ children }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const siguienteId = useRef(0);

  const notificar = useCallback((mensaje, tipo = 'info') => {
    setNotificaciones((actuales) => [
      ...actuales,
      { id: siguienteId.current++, mensaje, tipo: ESTILOS[tipo] ? tipo : 'info' },
    ]);
  }, []);

  const descartar = useCallback((id) => {
    setNotificaciones((actuales) => actuales.filter((notificacion) => notificacion.id !== id));
  }, []);

  return (
    <NotificacionesContext.Provider value={{ notificar }}>
      {children}
      <div
        className="toast-container position-fixed top-0 end-0 p-3 d-flex flex-column gap-2"
        style={{ zIndex: 1100 }}
      >
        {notificaciones.map(({ id, mensaje, tipo }) => (
          <Notificacion
            key={id}
            id={id}
            mensaje={mensaje}
            tipo={tipo}
            onDescartar={descartar}
          />
        ))}
      </div>
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  const context = useContext(NotificacionesContext);
  if (!context) {
    throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider.');
  }
  return context;
}
