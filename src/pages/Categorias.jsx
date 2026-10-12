import { Link } from "react-router-dom";
import { obtenerProductos } from "../utils/productos";

export default function Categorias() {
  const productos = obtenerProductos();

  const categorias = [
    ...new Set(productos.map((p) => p.categoria || "Poleras")),
  ];

  return (
    <main className="container my-5">
      <h1 className="fw-bold mb-4">Categorías</h1>

      {categorias.map((categoria) => {
        const lista = productos.filter(
          (p) => (p.categoria || "Poleras") === categoria
        );

        return (
          <section key={categoria} className="mb-5">
            <h2 className="h4 mb-3">{categoria}</h2>

            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
              {lista.map((p) => (
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
                      <h3 className="h6">{p.nombre}</h3>

                      <p className="fw-bold">
                        ${Number(p.precio).toLocaleString("es-CL")}
                      </p>

                      <Link
                        className="btn btn-dark"
                        to={`/detalles?id=${p.id}`}
                      >
                        Ver producto
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}