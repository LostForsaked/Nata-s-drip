import { Link } from "react-router-dom";
import { obtenerProductos } from "../utils/productos";

export default function Ofertas() {
  const productos = obtenerProductos().filter(
    (p) =>
      p.oferta === true ||
      Number(p.descuento) > 0 ||
      (p.precioOferta &&
        Number(p.precioOferta) < Number(p.precio))
  );

  return (
    <main className="container my-5">
      <h1 className="fw-bold mb-2">Ofertas</h1>

      <p className="text-secondary mb-4">
        Productos con descuentos disponibles.
      </p>

      {productos.length === 0 ? (
        <div className="alert alert-info">
          No hay ofertas activas actualmente.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
          {productos.map((p) => {
            const precioFinal =
              p.precioOferta &&
              Number(p.precioOferta) < Number(p.precio)
                ? Number(p.precioOferta)
                : Number(p.precio) *
                  (1 - Number(p.descuento || 0) / 100);

            return (
              <div className="col" key={p.id}>
                <div className="card h-100">
                  <img
                    src={
                      p.imagen?.startsWith("/")
                        ? p.imagen
                        : `/${p.imagen}`
                    }
                    className="card-img-top p-3"
                    style={{ height: 190, objectFit: "contain" }}
                    alt={p.nombre}
                  />

                  <div className="card-body">
                    <h2 className="h6">{p.nombre}</h2>

                    <p className="text-secondary text-decoration-line-through">
                      ${Number(p.precio).toLocaleString("es-CL")}
                    </p>

                    <p className="fw-bold text-danger">
                      ${Math.round(precioFinal).toLocaleString("es-CL")}
                    </p>

                    <Link
                      className="btn btn-dark"
                      to={`/detalles?id=${p.id}`}
                    >
                      Ver oferta
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}