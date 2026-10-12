
import { Link } from "react-router-dom";

export default function CompraFallida() {
  return (
    <div className="container py-5 text-center">
      <h1 className="text-danger">No se pudo completar la compra</h1>
      <p>Ocurrió un problema al procesar tu pedido.</p>

      <Link to="/carrito" className="btn btn-dark mt-3">
        Volver al carrito
      </Link>
    </div>
  );
}
