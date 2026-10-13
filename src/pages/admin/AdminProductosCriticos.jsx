import { Link } from 'react-router-dom';
import { obtenerProductosCriticos, nombreCategoria, obtenerSesion } from '../../data/db';
import { estadoStock } from '../../utils/formato';

export default function AdminProductosCriticos() {
  const esAdmin = obtenerSesion()?.rol === 'Administrador';
  const criticos = obtenerProductosCriticos().sort((a, b) => Number(a.stock) - Number(b.stock));

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="fw-bold m-0">Productos con stock crítico</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Volver a productos
        </Link>
      </div>

      <p className="text-secondary">
        Productos cuyo stock es igual o inferior al stock crítico definido. Conviene reponerlos pronto.
      </p>

      {criticos.length === 0 ? (
        <div className="alert alert-success">
          <i className="bi bi-check-circle me-2"></i> Ningún producto está en nivel crítico.
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Stock crítico</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => {
                  const estado = estadoStock(p);
                  return (
                    <tr key={p.id}>
                      <td>{p.codigo}</td>
                      <td>{p.nombre}</td>
                      <td>{nombreCategoria(p.categoriaId)}</td>
                      <td className="text-center fw-bold">{p.stock}</td>
                      <td className="text-center">{p.stockCritico}</td>
                      <td><span className={`badge ${estado.clase}`}>{estado.texto}</span></td>
                      <td className="text-end text-nowrap">
                        <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-secondary me-1" title="Ver detalle">
                          <i className="bi bi-eye"></i>
                        </Link>
                        {esAdmin && (
                          <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary" title="Reponer stock">
                            <i className="bi bi-pencil"></i> Reponer
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}