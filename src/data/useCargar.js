import { useCallback, useEffect, useState } from 'react';

/**
 * Carga datos asíncronos (de la API) al montar el componente.
 *
 *   const { datos, cargando, error, recargar } = useCargar(() => obtenerProductos(), []);
 *
 * - `deps`: cuándo volver a cargar (como en useEffect).
 * - `recargar()`: vuelve a pedir los datos (p. ej. después de eliminar algo).
 *   Mientras recarga, `datos` conserva el valor anterior para que la pantalla no parpadee.
 */
export function useCargar(cargador, deps = []) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado((e) => ({ ...e, cargando: true }));
    cargador()
      .then((datos) => !cancelado && setEstado({ datos, cargando: false, error: null }))
      .catch((error) => !cancelado && setEstado({ datos: null, cargando: false, error }));
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  return { ...estado, recargar };
}
