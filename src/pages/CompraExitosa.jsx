import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ResumenOrden from '../components/ResumenOrden';
import { buscarOrdenPorId } from '../data/db';
import { formatoFecha } from '../utils/formato';

export default function CompraExitosa() {
  const [params] = useSearchParams();
  const orden = buscarOrdenPorId(params.get('orden'));
  const [emailEnviado, setEmailEnviado] = useState(false);

  if (!orden || orden.estado !== 'Pagada') {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">No encontramos esa compra</h1>
        <Link to="/productos" className="btn btn-dark mt-3">Ir a la tienda</Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '850px' }}>
        <div className="d-flex justify-content-between flex-wrap gap-2">
          <h2 className="h3 fw-bold text-success">
            <i className="bi bi-check-circle me-2"></i>
            Se ha realizado la compra
          </h2>
          <div className="text-md-end text-muted small">
            <div>Orden <strong>{orden.numero}</strong></div>
            <div>{formatoFecha(orden.fechaPago || orden.fecha)}</div>
          </div>
        </div>
        <p className="text-secondary">Gracias por comprar en Nata's Drip. Este es el resumen de tu pedido.</p>

        <ResumenOrden orden={orden} />

        {emailEnviado && (
          <div className="alert alert-success">
            Enviamos la boleta a <strong>{orden.cliente.correo}</strong> (simulado).
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 justify-content-center no-imprimir">
          <button type="button" className="btn btn-danger" onClick={() => window.print()}>
            <i className="bi bi-printer me-1"></i> Imprimir boleta en PDF
          </button>
          <button type="button" className="btn btn-success" onClick={() => setEmailEnviado(true)}>
            <i className="bi bi-envelope me-1"></i> Enviar boleta por email
          </button>
          <Link to="/productos" className="btn btn-dark">Seguir comprando</Link>
        </div>
      </div>
    </main>
  );
}