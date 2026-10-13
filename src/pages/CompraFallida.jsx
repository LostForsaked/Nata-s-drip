import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import ResumenOrden from '../components/ResumenOrden';
import { buscarOrdenPorId } from '../data/db';
import { aprobarPago } from '../utils/pagos';

export default function CompraFallida() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orden = buscarOrdenPorId(params.get('orden'));
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  if (!orden) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">No encontramos esa orden</h1>
        <Link to="/carrito" className="btn btn-dark mt-3">Volver al carrito</Link>
      </main>
    );
  }

  // Si la orden ya quedó pagada (por ejemplo, al volver atrás), va directo al comprobante
  if (orden.estado === 'Pagada') {
    return <Navigate to={`/compra-exitosa?orden=${orden.id}`} replace />;
  }

  const reintentarPago = () => {
    setError('');
    setProcesando(true);
    setTimeout(() => {
      const resultado = aprobarPago(orden.id);
      if (resultado.ok) {
        navigate(`/compra-exitosa?orden=${orden.id}`, { replace: true });
      } else {
        setError(resultado.error);
        setProcesando(false);
      }
    }, 1500);
  };

  return (
    <main className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '850px' }}>
        <h2 className="h3 fw-bold text-danger">
          <i className="bi bi-x-circle me-2"></i>
          No se pudo realizar el pago
        </h2>
        <p className="text-secondary">
          Orden <strong>{orden.numero}</strong>. No se realizó ningún cobro y tu carrito sigue guardado.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          <button type="button" className="btn btn-success btn-lg" onClick={reintentarPago} disabled={procesando}>
            {procesando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Procesando pago...
              </>
            ) : (
              'VOLVER A REALIZAR EL PAGO'
            )}
          </button>
          <Link to="/carrito" className={`btn btn-outline-secondary btn-lg ${procesando ? 'disabled' : ''}`}>
            Volver al carrito
          </Link>
        </div>

        <h5 className="fw-bold">Detalle de la compra</h5>
        <ResumenOrden orden={orden} />
      </div>
    </main>
  );
}