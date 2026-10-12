
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerProductos } from "../data/db"

export default function Carrito() {
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [cuponInput, setCuponInput] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState(false);
  const [mensajeCupon, setMensajeCupon] = useState({
    texto: "",
    tipo: "",
  });

  useEffect(() => {
    try {
      const guardado = JSON.parse(
        localStorage.getItem("mi_carrito") || "[]"
      );
      setCarrito(Array.isArray(guardado) ? guardado : []);
    } catch {
      setCarrito([]);
    }
  }, []);

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("mi_carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const cambiarCantidad = (productoId, delta) => {
    const nuevoCarrito = carrito
      .map((item) => {
        if (String(item.id) !== String(productoId)) return item;

        const cantidad = Number(item.cantidad || 1) + delta;

        return cantidad > 0 ? { ...item, cantidad } : null;
      })
      .filter(Boolean);

    guardarCarrito(nuevoCarrito);
  };

  const eliminarProducto = (productoId) => {
    guardarCarrito(
      carrito.filter((item) => String(item.id) !== String(productoId))
    );
  };

  const vaciarCarrito = () => {
    guardarCarrito([]);
    setCuponAplicado(false);
    setCuponInput("");
    setMensajeCupon({ texto: "", tipo: "" });
  };

  const aplicarCupon = (e) => {
    e.preventDefault();

    if (cuponInput.trim().toUpperCase() === "NATAS10") {
      setCuponAplicado(true);
      setMensajeCupon({
        texto: "¡Cupón del 10% aplicado!",
        tipo: "text-success",
      });
    } else {
      setCuponAplicado(false);
      setMensajeCupon({
        texto: "Cupón inválido.",
        tipo: "text-danger",
      });
    }
  };

  const catalogo = obtenerProductos();

  const itemsConDetalle = carrito
    .map((item) => {
      const producto = catalogo.find(
        (p) =>
          String(p.id) === String(item.id) ||
          String(p.codigo) === String(item.id)
      );

      if (!producto) return null;

      const cantidad = Number(item.cantidad || 1);
      const precio = Number(producto.precio || 0);

      return {
        ...producto,
        tituloMostrado: producto.nombre || producto.titulo || "Producto",
        imagenMostrada: producto.imagen || producto.img || "",
        cantidad,
        precio,
        subtotalItem: precio * cantidad,
      };
    })
    .filter(Boolean);

  const subtotal = itemsConDetalle.reduce(
    (total, item) => total + item.subtotalItem,
    0
  );

  const descuento = cuponAplicado ? subtotal * 0.1 : 0;
  const total = subtotal - descuento;

  const pagar = () => {
    if (itemsConDetalle.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    navigate("/checkout", {
      state: {
        subtotal,
        descuento,
        total,
        cuponAplicado,
      },
    });
  };

  return (
    <main className="container my-5">
      <h2 className="fw-bold mb-4">Mi carrito de compras</h2>

      <div className="row g-4">
        <div className="col-lg-8" id="contenedorCarrito">
          {itemsConDetalle.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
              <h4>Tu carrito está vacío</h4>
              <p className="text-secondary">
                Revisa nuestro catálogo y encuentra tus favoritos.
              </p>
              <Link to="/productos" className="btn btn-primary rounded-pill">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            itemsConDetalle.map((producto) => (
              <div
                key={producto.id || producto.codigo}
                className="card border-0 shadow-sm rounded-4 mb-3 p-3"
              >
                <div className="row align-items-center g-3">
                  <div className="col-3 col-sm-2 text-center">
                    {producto.imagenMostrada && (
                      <img
                        src={producto.imagenMostrada}
                        className="img-fluid rounded-3"
                        style={{
                          maxHeight: "80px",
                          objectFit: "cover",
                        }}
                        alt={producto.tituloMostrado}
                      />
                    )}
                  </div>

                  <div className="col-9 col-sm-4">
                    <h6 className="fw-bold mb-1">
                      {producto.tituloMostrado}
                    </h6>
                    <span className="text-muted small">
                      ${producto.precio.toLocaleString("es-CL")} c/u
                    </span>
                  </div>

                  <div className="col-6 col-sm-3 d-flex align-items-center justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-circle"
                      onClick={() => cambiarCantidad(producto.id, -1)}
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>

                    <span className="fw-bold">{producto.cantidad}</span>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-circle"
                      onClick={() => cambiarCantidad(producto.id, 1)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <div className="col-6 col-sm-3 text-end fw-bold text-primary">
                    ${producto.subtotalItem.toLocaleString("es-CL")}

                    <button
                      type="button"
                      className="btn btn-link text-danger p-0 ms-2"
                      onClick={() => eliminarProducto(producto.id)}
                      aria-label="Eliminar producto"
                    >
                      <i className="bi bi-x-circle fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm rounded-4 p-4"
            style={{ position: "sticky", top: "20px" }}
          >
            <h5 className="fw-bold mb-3">Resumen de compra</h5>

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-CL")}</span>
            </div>

            {cuponAplicado && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Descuento (10%)</span>
                <span>-${descuento.toLocaleString("es-CL")}</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold">TOTAL:</span>
              <span className="fs-4 fw-bold text-primary">
                ${total.toLocaleString("es-CL")}
              </span>
            </div>

            <form onSubmit={aplicarCupon} className="mb-3">
              <label className="form-label small text-muted">
                ¿Tienes un cupón de descuento?
              </label>

              <div className="input-group">
                <input
                  type="text"
                  value={cuponInput}
                  onChange={(e) => setCuponInput(e.target.value)}
                  className="form-control"
                  placeholder="Ej: NATAS10"
                />

                <button className="btn btn-outline-secondary" type="submit">
                  Aplicar
                </button>
              </div>

              {mensajeCupon.texto && (
                <small className={`d-block mt-1 ${mensajeCupon.tipo}`}>
                  {mensajeCupon.texto}
                </small>
              )}
            </form>

            <button
              type="button"
              className="btn btn-success btn-lg w-100 fw-bold py-3 mb-2"
              onClick={pagar}
            >
              PAGAR AHORA
            </button>

            <button
              type="button"
              className="btn btn-link text-danger btn-sm text-decoration-none w-100"
              onClick={vaciarCarrito}
            >
              <i className="bi bi-trash me-1"></i>
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
