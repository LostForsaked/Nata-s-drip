import { Link, useParams } from 'react-router-dom';
import { buscarProductoPorId, esOferta, precioFinal } from '../../data/db';
import { useSesion } from '../../context/SesionContext';
import { useCargar } from '../../data/useCargar';
import Cargando, { ErrorCarga } from '../../components/Cargando';

import { formatoCLP, etiquetaPrecio, estadoStock } from '../../utils/formato';

export default function AdminProductoDetalle() {
  const { id } = useParams();
  const esAdmin = useSesion().sesion?.rol === 'Administrador';
  const { datos: producto, cargando, error, recargar } = useCargar(() => buscarProductoPorId(id), [id]);

  if (error) return <ErrorCarga error={error} onReintentar={recargar} />;
  if (cargando && !producto) return <Cargando />;

  if (!producto) {
    return (
      <>
        <h1 className="fw-bold mb-3">Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver a productos</Link>
      </>
    );
  }

  const estado = estadoStock(producto);
  const tieneCritico = producto.stockCritico !== '' && producto.stockCritico != null;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="fw-bold m-0">{producto.nombre}</h1>
        <div className="d-flex gap-2">
          <Link to="/admin/productos" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i> Volver
          </Link>
          {esAdmin && (
            <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-primary">
              <i className="bi bi-pencil me-1"></i> Editar
            </Link>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded-3" style={{ maxHeight: '300px' }} />
          </div>

          <div className="col-md-8">
            <dl className="row mb-0">
              <dt className="col-sm-4">Código</dt>
              <dd className="col-sm-8">{producto.codigo}</dd>

              <dt className="col-sm-4">Categoría</dt>
              <dd className="col-sm-8">{producto.categoria}</dd>

              <dt className="col-sm-4">Descripción</dt>
              <dd className="col-sm-8">{producto.descripcion || <span className="text-muted">Sin descripción</span>}</dd>

              <dt className="col-sm-4">Precio</dt>
              <dd className="col-sm-8">{etiquetaPrecio(producto.precio)}</dd>

              <dt className="col-sm-4">Oferta</dt>
              <dd className="col-sm-8">
                {esOferta(producto) ? (
                  <>
                    <span className="badge bg-danger me-2">-{producto.descuento}%</span>
                    Precio final: <strong>{etiquetaPrecio(precioFinal(producto))}</strong>
                    <span className="text-muted text-decoration-line-through ms-2">{formatoCLP(producto.precio)}</span>
                  </>
                ) : (
                  <span className="text-muted">Sin oferta</span>
                )}
              </dd>

              <dt className="col-sm-4">Stock</dt>
              <dd className="col-sm-8">
                {producto.stock} <span className={`badge ${estado.clase} ms-2`}>{estado.texto}</span>
              </dd>

              <dt className="col-sm-4">Stock crítico</dt>
              <dd className="col-sm-8">{tieneCritico ? producto.stockCritico : <span className="text-muted">No definido</span>}</dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}