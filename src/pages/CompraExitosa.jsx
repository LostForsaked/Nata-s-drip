
import { Link } from "react-router-dom";

export default function CompraExitosa() {
  return (
    <div className="container py-5 text-center">
      <h1 className="text-success">¡Compra realizada con éxito!</h1>
      <p>Gracias por comprar en Nata's Drip.</p>

      <Link to="/productos" className="btn btn-dark mt-3">
        Seguir comprando
      </Link>
    </div>
  );
}
