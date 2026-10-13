import TarjetaProducto from '../components/TarjetaProducto';
import { obtenerProductos, esOferta } from '../data/db';

export default function Ofertas() {
  // Mayor descuento primero
  const ofertas = obtenerProductos()
    .filter(esOferta)
    .sort((a, b) => Number(b.descuento) - Number(a.descuento));

  return (
    <main className="container my-5">
      <h1 className="fw-bold mb-2">Ofertas</h1>
      <p className="text-secondary mb-4">Productos con descuento disponibles por tiempo limitado.</p>

      {ofertas.length === 0 ? (
        <div className="alert alert-info">No hay ofertas activas actualmente.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {ofertas.map((p) => (
            <div className="col" key={p.id}>
              <TarjetaProducto producto={p} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}