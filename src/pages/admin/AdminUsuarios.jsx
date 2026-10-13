import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


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
    <>
      
      

      {/* Contenido Principal */}
      <div>
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
      </div>

    </>
  );
}