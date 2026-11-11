import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { obtenerSesion } from '../data/db';

const SesionContext = createContext({
  sesion: null,
  cargando: true,
  refrescar: () => {},
  establecerSesion: () => {},
});

/**
 * Guarda en memoria el usuario logueado (consultado a la API / MySQL).
 * Reemplaza a obtenerSesion() síncrono que leía localStorage.
 */
export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    try {
      setSesion(await obtenerSesion());
    } catch {
      setSesion(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    refrescar();
    window.addEventListener('sesionActualizada', refrescar);
    return () => window.removeEventListener('sesionActualizada', refrescar);
  }, [refrescar]);

  // establecerSesion: actualiza el usuario al instante (p. ej. justo después de iniciar sesión),
  // sin esperar a que termine la consulta de refrescar().
  const valor = useMemo(
    () => ({ sesion, cargando, refrescar, establecerSesion: setSesion }),
    [sesion, cargando, refrescar]
  );
  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

/** { sesion, cargando, refrescar, establecerSesion } — sesion es el usuario (sin contraseña) o null. */
// eslint-disable-next-line react-refresh/only-export-components
export function useSesion() {
  return useContext(SesionContext);
}
