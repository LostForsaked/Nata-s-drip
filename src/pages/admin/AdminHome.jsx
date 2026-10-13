import { Link } from 'react-router-dom';
import {
  obtenerSesion,
  obtenerProductos,
  obtenerProductosCriticos,
  obtenerUsuarios,
  obtenerOrdenes,
} from '../../data/db';
import { formatoCLP } from '../../utils/formato';

const TODOS = ['Administrador', 'Vendedor'];

const ACCESOS = [
  { to: '/admin/ordenes', icono: 'bi-receipt', titulo: 'Órdenes', texto: 'Revisa las compras realizadas y sus boletas.', roles: TODOS },
  { to: '/admin/productos', icono: 'bi-box-seam', titulo: 'Productos', texto: 'Inventario y detalles de los productos.', roles: TODOS },
  { to: '/admin/categorias', icono: 'bi-tags', titulo: 'Categorías', texto: 'Organiza los productos por categoría.', roles: ['Administrador'] },
  { to: '/admin/usuarios', icono: 'bi-people', titulo: 'Usuarios', texto: 'Cuentas de usuario y sus roles.', roles: ['Administrador'] },
  { to: '/admin/reportes', icono: 'bi-graph-up', titulo: 'Reportes', texto: 'Resumen de ventas e inventario.', roles: ['Administrador'] },
  { to: '/admin/perfil', icono: 'bi-person', titulo: 'Perfil', texto: 'Tu información de cuenta.', roles: TODOS },
];

export default function AdminHome() {
  const sesion = obtenerSesion();
  const esAdmin = sesion?.rol === 'Administrador';

  const pagadas = obtenerOrdenes().filter((o) => o.estado === 'Pagada');
  const totalVendido = pagadas.reduce((acc, o) => acc + Number(o.total), 0);
  const criticos = obtenerProductosCriticos().length;

  return (
    <>
      <header className="mb-4">
        <h1 className="fw-bold text-dark">¡Hola, {sesion?.nombre}!</h1>
        <p className="text-secondary mb-0">Resumen de la actividad de la tienda.</p>
      </header>

      {criticos > 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Hay <strong>{criticos}</strong> {criticos === 1 ? 'producto' : 'productos'} con stock crítico.
          </span>
          <Link to="/admin/productos/criticos" className="alert-link">Ver listado</Link>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary border-0 rounded-4 h-100">
            <div className="card-body">
              <h2 className="h6 text-uppercase">Compras</h2>
              <p className="display-6 fw-bold mb-1">{pagadas.length}</p>
              <small>Total vendido: {formatoCLP(totalVendido)}</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success border-0 rounded-4 h-100">
            <div className="card-body">
              <h2 className="h6 text-uppercase">Productos</h2>
              <p className="display-6 fw-bold mb-1">{obtenerProductos().length}</p>
              <small>Con stock crítico: {criticos}</small>
            </div>
          </div>
        </div>

        {esAdmin && (
          <div className="col-md-4">
            <div className="card text-dark bg-warning border-0 rounded-4 h-100">
              <div className="card-body">
                <h2 className="h6 text-uppercase">Usuarios</h2>
                <p className="display-6 fw-bold mb-1">{obtenerUsuarios().length}</p>
                <small>Clientes: {obtenerUsuarios().filter((u) => u.rol === 'Cliente').length}</small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
        {ACCESOS.filter((a) => a.roles.includes(sesion?.rol)).map((a) => (
          <div className="col" key={a.to}>
            <Link to={a.to} className="card h-100 border-0 shadow-sm rounded-4 text-decoration-none text-center p-3">
              <i className={`bi ${a.icono} fs-2 text-primary`}></i>
              <h3 className="h6 text-dark mt-2">{a.titulo}</h3>
              <p className="small text-muted mb-0">{a.texto}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}