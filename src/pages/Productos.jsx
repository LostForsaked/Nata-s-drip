import { useSearchParams } from "react-router-dom";
import TarjetaProducto from '../components/TarjetaProductos';
import { obtenerProductos, obtenerCategorias, precioFinal } from "../data/db";

function Productos(){
  const [params, setParams] = useSearchParams();

  const q = params.get('q') || '';
  const cat = params.get('cat') || '';
  const orden = params.get('orden') || '';

  const actualizarFiltro = (clave, valor) => {
    const nuevos = new URLSearchParams(params);
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    setParams(nuevos, { replace: true});
  };

  const texto = q.trim().toLowerCase();

  let lista = obtenerProductos().filter((p) => {
    const coincideTexto =
      !texto ||
      p.nombre.toLowerCase().includes(texto) ||
      (p.descripcion || '').toLowerCase().includes(texto);
    const coincideCategoria = !cat || String(p.categoriaId) === cat;
    return coincideTexto && coincideCategoria;
  });


  if (orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  if (orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  if (orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre));

  const hayFiltros = q || cat || orden;

  return (
    <main className="container my-5">
      <h2 className="text-center fw-bold mb-4 text-uppercase">Productos</h2>

      {/* Filtros */}
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-5">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o descripción..."
            value={q}
            onChange={(e) => actualizarFiltro('q', e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={cat} onChange={(e) => actualizarFiltro('cat', e.target.value)}>
            <option value="">Todas las categorías</option>
            {obtenerCategorias().map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={orden} onChange={(e) => actualizarFiltro('orden', e.target.value)}>
            <option value="">Ordenar por...</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre (A-Z)</option>
          </select>
        </div>
        <div className="col-12 col-md-1 d-grid">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={!hayFiltros}
            onClick={() => setParams({}, { replace: true })}
            title="Limpiar filtros"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <p className="text-muted small">
        {lista.length} {lista.length === 1 ? 'producto' : 'productos'}
      </p>

      {lista.length === 0 ? (
        <div className="alert alert-info">No encontramos productos con esos filtros.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {lista.map((p) => (
            <div className="col" key={p.id}>
              <TarjetaProducto producto={p} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Productos;