import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    // Lógica para cerrar sesión (si tienes guardado token o sesión en localStorage)
    localStorage.removeItem('usuarioSesion');
    navigate('/login');
  };

  return (
    <div className="admin-layout d-flex" style={{ minHeight: '100vh' }}>
      
      {/* Sidebar Lateral */}
      <aside className="admin-sidebar bg-dark text-white p-3 d-flex flex-column justify-content-between" style={{ width: '260px', minHeight: '100vh' }}>
        <div>
          {/* Logo y Nombre */}
          <div className="admin-logo d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary">
            <img src="/img/Logo.jpg" alt="Logo" width="40" className="rounded" />
            <span className="fw-bold fs-5">Nata's Drip</span>
          </div>

          {/* Menú de Navegación Admin */}
          <nav className="admin-nav">
            <ul className="nav nav-pills flex-column gap-2">
              <li className="nav-item">
                <Link to="/admin" className="nav-link active text-white bg-primary d-flex align-items-center gap-2">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/productos" className="nav-link text-white-50 d-flex align-items-center gap-2">
                  <i className="bi bi-box-seam"></i> Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/usuarios" className="nav-link text-white-50 d-flex align-items-center gap-2">
                  <i className="bi bi-people"></i> Usuarios
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Enlaces Inferiores */}
        <div className="admin-nav-bottom border-top border-secondary pt-3 d-flex flex-column gap-2">
          <Link to="/" className="text-white-50 text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-box-arrow-left"></i> Volver a la tienda
          </Link>
          <a href="#" onClick={handleLogout} className="text-danger text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-box-arrow-right"></i> Cerrar sesión
          </a>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="admin-content flex-grow-1 p-4 bg-light">
        <header className="admin-header mb-4">
          <h1 className="fw-bold text-dark">¡Hola, Administrador!</h1>
        </header>

        <section className="admin-welcome card border-0 shadow-sm p-4 rounded-4">
          <p className="lead mb-0 text-secondary">
            Bienvenido al panel de administración de <strong>Nata's Drip</strong>. Desde aquí puedes gestionar los productos y usuarios de la tienda.
          </p>
        </section>
      </main>

    </div>
  );
}