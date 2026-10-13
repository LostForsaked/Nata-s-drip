import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ModalConfirmar from '../../components/ModalConfirmar';
import {
  obtenerProductos,
  obtenerCategorias,
  obtenerProductosCriticos,
  nombreCategoria,
  eliminarProducto,
  obtenerSesion,
} from '../../data/db';
import { formatoCLP, estadoStock } from '../../utils/formato';

export default function AdminProductos() {
  const location = useLocation();
  const esAdmin = obtenerSesion()?.rol === 'Administrador'; // el Vendedor solo puede ver

  const [productos, setProductos] = useState(() => obtenerProductos());
  const [mensaje, setMensaje] = useState(location.state?.mensaje || '');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  const texto = q.trim().toLowerCase();
  const filtrados = productos.filter(
    (p) =>
      (!texto || p.nombre.toLowerCase().includes(texto) || String(p.codigo).toLowerCase().includes(texto)) &&
      (!cat || String(p.categoriaId) === cat)
  );

  const cantidadCriticos = obtenerProductosCriticos().length;

  const confirmarEliminar = () => {
    if (!aEliminar) return;

    eliminarProducto(aEliminar.id);
    setProductos(obtenerProductos());
    setMensaje(`Producto "${aEliminar.nombre}" eliminado.`);
    setAEliminar(null);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="fw-bold m-0">Productos</h1>
        <div className="d-flex gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-warning">
            <i className="bi bi-exclamation-triangle me-1"></i> Stock crítico
            <span className="badge bg-warning text-dark ms-2">{cantidadCriticos}</span>
          </Link>
          {esAdmin && (
            <Link to="/admin/productos/nuevo" className="btn btn-dark">
              <i className="bi bi-plus-lg me-1"></i> Nuevo producto
            </Link>
          )}
        </div>
      </div>

      {mensaje && (
        <div className="alert alert-success alert-dismissible" role="alert">
          {mensaje}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setMensaje('')}></button>
        </div>
      )}

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por código o nombre..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {obtenerCategorias().map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Imagen</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th className="text-end">Precio</th>
                <th className="text-center">Stock</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">No hay productos que mostrar.</td>
                </tr>
              )}
              {filtrados.map((p) => {
                const estado = estadoStock(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <img src={p.imagen} alt={p.nombre} width="48" height="48" className="rounded object-fit-cover" />
                    </td>
                    <td>{p.codigo}</td>
                    <td>
                      {p.nombre}
                      {Number(p.descuento) > 0 && <span className="badge bg-danger ms-2">-{p.descuento}%</span>}
                    </td>
                    <td>{nombreCategoria(p.categoriaId)}</td>
                    <td className="text-end">{formatoCLP(p.precio)}</td>
                    <td className="text-center">{p.stock}</td>
                    <td><span className={`badge ${estado.clase}`}>{estado.texto}</span></td>
                    <td className="text-end text-nowrap">
                      <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-secondary me-1" title="Ver detalle">
                        <i className="bi bi-eye"></i>
                      </Link>
                      {esAdmin && (
                        <>
                          <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-1" title="Editar">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button type="button" className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => setAEliminar(p)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ModalConfirmar
        show={aEliminar !== null}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que quieres eliminar "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  );
}