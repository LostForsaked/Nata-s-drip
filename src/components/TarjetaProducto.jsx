import { useState } from "react";
import { Link } from "react-router-dom";
import { agregarAlCarritoGlobal } from "../utils/cardLogic";
import { esOferta, precioFinal } from "../data/db";
import { formatoCLP, etiquetaPrecio } from "../utils/formato";

export default function TarjetaProducto({producto}) {
    const [agregado, setAregado] = useState(false);

    const stock = Number(producto.stock);
    const agotado = stock<=0;
    const oferta = esOferta(producto);
    const pocasUnidades =
        !agotado &&
        producto.stockCritico !== '' &&
        producto.stockCritico !== undefined &&
        stock <= Number(producto.stockCritico);

    const handleAgregar = () => {
        const resultado = agregarAlCarritoGlobal(producto.id, 1);
        if (resultado.ok) {
            setAregado(true);
            setTimeout(() => setAregado(false), 1200);
        }
    }

    return (
    <div className="card h-100 border-0 shadow-sm rounded-4 p-3 position-relative text-center">
      {oferta && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-3">
          -{producto.descuento}%
        </span>
      )}
      {agotado && (
        <span className="badge bg-secondary position-absolute top-0 end-0 m-3">Agotado</span>
      )}

      <Link to={`/detalles?id=${producto.id}`} className="text-decoration-none">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="card-img-top rounded-3 mb-3 object-fit-cover"
          style={{ height: '200px' }}
        />
        <h6 className="fw-semibold text-dark mb-1">{producto.nombre}</h6>
      </Link>

      <div className="mb-2">
        {oferta && (
          <span className="text-secondary text-decoration-line-through me-2">
            {formatoCLP(producto.precio)}
          </span>
        )}
        <span className={`fw-bold ${oferta ? 'text-danger' : 'text-primary'}`}>
          {etiquetaPrecio(precioFinal(producto))}
        </span>
      </div>

        {pocasUnidades && <p className="text-warning small mb-2">¡Últimas {stock} unidades!</p>}

      <button
        type="button"
        className={`btn ${agregado ? 'btn-success' : 'btn-outline-dark'} rounded-pill w-100 mt-auto`}
        disabled={agotado}
        onClick={handleAgregar}
      >
        {agotado ? (
          'Sin stock'
        ) : agregado ? (
          <><i className="bi bi-check2 me-1"></i> Añadido</>
        ) : (
          <><i className="bi bi-cart-plus me-1"></i> Añadir</>
        )}
      </button>
    </div>
  );
}
