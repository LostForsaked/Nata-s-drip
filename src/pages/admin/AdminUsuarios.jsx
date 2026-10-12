import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Funciones de gestión de usuarios basadas en tu lógica original
function obtenerUsuarios() {
  const usuarios = localStorage.getItem("tienda_usuarios");
  if (!usuarios) {
    const usuariosIniciales = [
      { id: 1, nombre: "Admin Nata", email: "admin@gmail.com", password: "admin", rol: "Administrador" },
      { id: 2, nombre: "Admin Ruben", email: "admin2@gmail.com", password: "admin", rol: "Administrador" },
      { id: 3, nombre: "Cliente Demo", email: "cliente@gmail.com", password: "1234", rol: "Cliente" }
    ];
    localStorage.setItem("tienda_usuarios", JSON.stringify(usuariosIniciales));
    return usuariosIniciales;
  }
  return JSON.parse(usuarios);
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("tienda_usuarios", JSON.stringify(usuarios));
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    setUsuarios(obtenerUsuarios());
  }, []);

  const handleEliminarUsuario = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      const usuariosActualizados = usuarios.filter(u => u.id !== id);
      guardarUsuarios(usuariosActualizados);
      setUsuarios(usuariosActualizados);
    }
  };

  return (
    <div className="admin-layout d-flex" style={{ minHeight: '100vh' }}>
      
      {/* Sidebar Lateral */}
      <aside className="admin-sidebar bg-dark text-white p-3 d-flex flex-column justify-content-between" style={{ width: '260px', minHeight: '100vh' }}>
        <div>
          <div className="admin-logo d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary">
            <img src="/img/Logo.jpg" alt="Logo" width="40" className="rounded" />
            <span className="fw-bold fs-5">Nata's Drip</span>
          </div>

          <nav className="admin-nav">
            <ul className="nav nav-pills flex-column gap-2">
              <li className="nav-item">
                <Link to="/admin" className="nav-link text-white-50 d-flex align-items-center gap-2">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/productos" className="nav-link text-white-50 d-flex align-items-center gap-2">
                  <i className="bi bi-box-seam"></i> Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/usuarios" className="nav-link active text-white bg-primary d-flex align-items-center gap-2">
                  <i className="bi bi-people"></i> Usuarios
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="admin-nav-bottom border-top border-secondary pt-3 d-flex flex-column gap-2">
          <Link to="/" className="text-white-50 text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-box-arrow-left"></i> Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="admin-content flex-grow-1 p-4 bg-light">
        <header className="admin-header admin-header-flex d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold text-dark m-0">Gestión de Usuarios</h1>
          {/* Si más adelante agregas la vista de nuevo usuario, puedes configurar su ruta */}
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary rounded-pill px-4">
            <i className="bi bi-person-plus-fill me-1"></i> Nuevo Usuario
          </Link>
        </header>

        <section className="admin-tabla-container card border-0 shadow-sm p-4 rounded-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="fw-semibold">{usuario.id}</td>
                    <td className="fw-bold">{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>
                      {usuario.rol === "Administrador" ? (
                        <span className="badge bg-danger">Administrador</span>
                      ) : (
                        <span className="badge bg-secondary">Cliente</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminarUsuario(usuario.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usuarios.length === 0 && (
            <p id="mensaje-vacio-usuarios" className="text-muted text-center py-4">
              Aún no hay usuarios registrados.
            </p>
          )}
        </section>
      </main>

    </div>
  );
}