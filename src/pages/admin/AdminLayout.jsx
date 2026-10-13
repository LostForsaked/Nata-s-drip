import {Link, NavLink, Outlet, useNavigate} from 'react-router-dom';
import { obtenerSesion, cerrarSesion } from '../../data/db';

const TODOS = ['Administrador', 'Vendedor'];

const MENU = [
  { to: '/admin', icono: 'bi-speedometer2', texto: 'Dashboard', roles: TODOS, end: true },
  { to: '/admin/ordenes', icono: 'bi-receipt', texto: 'Órdenes', roles: TODOS },
  { to: '/admin/productos', icono: 'bi-box-seam', texto: 'Productos', roles: TODOS },
  { to: '/admin/categorias', icono: 'bi-tags', texto: 'Categorías', roles: ['Administrador'] },
  { to: '/admin/usuarios', icono: 'bi-people', texto: 'Usuarios', roles: ['Administrador'] },
  { to: '/admin/reportes', icono: 'bi-graph-up', texto: 'Reportes', roles: ['Administrador'] },
];

export default function AdminLayout(){
    const navigate = useNavigate();
    const sesion = obtenerSesion();

    const handleLogout = () => {
        cerrarSesion();
        navigate('/login');
    };

    const claseLink = ({isActive}) =>
        'nav-link d-flex align-items-center gap-2 ' + (isActive ? 'active bg-primary text-white' : 'text-white-50');



      return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <aside className="admin-sidebar bg-dark text-white p-3 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <img src="/img/Logo.jpg" alt="Logo" width="40" className="rounded" />
            <span className="fw-bold fs-5">Nata's Drip</span>
          </div>

          {/* Botón de menú solo en pantallas chicas */}
          <button
            className="btn btn-outline-light btn-sm d-md-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminMenu"
            aria-controls="adminMenu"
            aria-expanded="false"
          >
            <i className="bi bi-list"></i> Menú
          </button>
        </div>

        <div className="collapse d-md-flex flex-column flex-grow-1 mt-3" id="adminMenu">
          <nav className="flex-grow-1 border-top border-secondary pt-3">
            <ul className="nav nav-pills flex-column gap-2">
              {MENU.filter((op) => op.roles.includes(sesion?.rol)).map((op) => (
                <li className="nav-item" key={op.to}>
                  <NavLink to={op.to} end={op.end} className={claseLink}>
                    <i className={`bi ${op.icono}`}></i> {op.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-top border-secondary pt-3 d-flex flex-column gap-2">
            <div className="small text-white-50">
              {sesion?.nombre} <span className="badge bg-secondary ms-1">{sesion?.rol}</span>
            </div>
            <NavLink to="/admin/perfil" className="text-white-50 text-decoration-none d-flex align-items-center gap-2">
              <i className="bi bi-person"></i> Mi perfil
            </NavLink>
            <Link to="/" className="text-white-50 text-decoration-none d-flex align-items-center gap-2">
              <i className="bi bi-box-arrow-left"></i> Volver a la tienda
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-link text-danger text-decoration-none p-0 text-start d-flex align-items-center gap-2"
            >
              <i className="bi bi-box-arrow-right"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido de cada página admin */}
      <main className="flex-grow-1 p-4 bg-light admin-main">
        <Outlet />
      </main>
    </div>
  );
}

