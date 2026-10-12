
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");

  const resumen = location.state || {};

  const finalizarCompra = (e) => {
    e.preventDefault();

    const carrito = JSON.parse(
      localStorage.getItem("mi_carrito") || "[]"
    );

    if (!carrito.length) {
      setError("Tu carrito está vacío. Agrega productos antes de comprar.");
      return;
    }

    if (!nombre.trim() || !correo.trim() || !direccion.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    // Vaciar el carrito después de confirmar la compra simulada.
    localStorage.setItem("mi_carrito", JSON.stringify([]));

    // Notificar a otros componentes que el carrito cambió.
    window.dispatchEvent(new Event("carritoActualizado"));

    // Guardar datos básicos de la compra simulada.
    localStorage.setItem(
      "ultima_compra",
      JSON.stringify({
        nombre,
        correo,
        direccion,
        subtotal: resumen.subtotal || 0,
        descuento: resumen.descuento || 0,
        total: resumen.total || 0,
        fecha: new Date().toISOString(),
      })
    );

    navigate("/compra-exitosa", { replace: true });
  };

  return (
    <main className="container py-5">
      <h2 className="fw-bold mb-4">Finalizar compra</h2>

      <div className="row g-4">
        <div className="col-lg-7">
          <form
            onSubmit={finalizarCompra}
            className="card border-0 shadow-sm rounded-4 p-4"
          >
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección de envío</label>
              <input
                type="text"
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-success btn-lg w-100">
              Confirmar compra
            </button>

            <Link to="/carrito" className="btn btn-outline-secondary mt-2">
              Volver al carrito
            </Link>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold">Resumen de compra</h5>

            <p className="mb-2">
              Subtotal: $
              {(resumen.subtotal || 0).toLocaleString("es-CL")}
            </p>

            <p className="mb-2">
              Descuento: $
              {(resumen.descuento || 0).toLocaleString("es-CL")}
            </p>

            <hr />

            <h4 className="fw-bold">
              Total: ${(resumen.total || 0).toLocaleString("es-CL")}
            </h4>

            <small className="text-muted mt-2">
              Compra de demostración; no se procesa ningún pago real.
            </small>
          </div>
        </div>
      </div>
    </main>
  );
}
