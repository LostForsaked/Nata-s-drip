import { Link, useParams } from 'react-router-dom';
import ResumenOrden from '../../components/ResumenOrden';
import { buscarOrdenPorId } from '../../data/db';
import { formatoCLP, formatoFecha } from '../../utils/formato';

export default function AdminBoleta() {
  const { id } = useParams();
  const orden = buscarOrdenPorId(id);

  if (!orden) {
    return (
      <>
        <p>No se encontró la orden.</p>
        <Link to="/admin/ordenes" className="btn btn-dark">Volver</Link>
      </>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
        <h1 className="h3 fw-bold">Boleta {orden.numero}</h1>
        <div className="text-muted small">{formatoFecha(orden.fecha)} · {orden.estado}</div>
      </div>
      <ResumenOrden orden={orden} />
      <div className="text-end fs-5 fw-bold mb-3">Total: {formatoCLP(orden.total)}</div>
      <div className="d-flex gap-2 no-imprimir">
        <button className="btn btn-danger" onClick={() => window.print()}>Imprimir PDF</button>
        <Link to="/admin/ordenes" className="btn btn-outline-secondary">Volver</Link>
      </div>
    </div>
  );
}