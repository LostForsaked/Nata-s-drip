import { Link } from 'react-router-dom';
import { obtenerOrdenes } from '../../data/db';
import { formatoCLP, formatoFecha } from '../../utils/formato';

const CLASE_ESTADO = {
  'Pagada': 'bg-success',
  'Pago fallido': 'bg-danger',
  'pendiente de pago': 'bg-warning text-dark',
};

export default function AdminOrdenes() {
  const ordenes = [...obtenerOrdenes()].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <>
      <h1 className="fw-bold mb-4">Órdenes y boletas</h1>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td className="fw-semibold">{o.numero}</td>
                  <td>{formatoFecha(o.fecha)}</td>
                  <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                  <td>{formatoCLP(o.total)}</td>
                  <td><span className={'badge ' + (CLASE_ESTADO[o.estado] || 'bg-secondary')}>{o.estado}</span></td>
                  <td className="text-end">
                    <Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">Ver boleta</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ordenes.length === 0 && <p className="text-muted text-center py-4 mb-0">Aún no hay órdenes.</p>}
      </div>
    </>
  );
}