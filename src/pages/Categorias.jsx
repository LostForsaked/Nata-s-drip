import { Link, useSearchParams } from 'react-router-dom';
import TarjetaProducto from '../components/TarjetaProducto';
import { obtenerCategorias, obtenerProductos } from '../data/db';

export default function Categorias() {
  const [params] = useSearchParams();
  const catSeleccionada = params.get('cat'); // /categorias?cat=2

  const categorias = obtenerCategorias();
  const productos = obtenerProductos();

  // Con ?cat= se muestra solo esa categoría; sin él, todas
  const visibles = catSeleccionada
    ? categorias.filter((c) => String(c.id) === catSeleccionada)
    : categorias;

  return (
    <main className="container my-5">
      <h1 className="fw-bold mb-4">Categorías</h1>

      {/* Tarjetas de categorías */}
      <div className="row row-cols-2 row-cols-md-4 g-3 mb-5">
        {categorias.map((c) => {
          const delaCategoria = productos.filter((p) => String(p.categoriaId) === String(c.id));
          const activa = String(c.id) === catSeleccionada;
          return (
            <div className="col" key={c.id}>
              <Link
                to={`/categorias?cat=${c.id}`}
                className={`card h-100 text-center text-decoration-none shadow-sm ${activa ? 'border-primary border-2' : 'border-0'}`}
              >
                {delaCategoria[0] && (
                  <img
                    src={delaCategoria[0].imagen}
                    alt={c.nombre}
                    className="card-img-top object-fit-cover"
                    style={{ height: '110px' }}
                  />
                )}
                <div className="card-body py-2">
                  <h2 className="h6 text-dark mb-0">{c.nombre}</h2>
                  <small className="text-muted">{delaCategoria.length} productos</small>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {catSeleccionada && (
        <p>
          <Link to="/categorias" className="text-decoration-none">
            <i className="bi bi-arrow-left"></i> Ver todas las categorías
          </Link>
        </p>
      )}

      {/* Productos por categoría */}
      {visibles.length === 0 && <div className="alert alert-warning">Esa categoría no existe.</div>}

      {visibles.map((c) => {
        const lista = productos.filter((p) => String(p.categoriaId) === String(c.id));
        return (
          <section key={c.id} className="mb-5">
            <h2 className="h4 mb-3">{c.nombre}</h2>
            {lista.length === 0 ? (
              <p className="text-muted">Todavía no hay productos en esta categoría.</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {lista.map((p) => (
                  <div className="col" key={p.id}>
                    <TarjetaProducto producto={p} />
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}