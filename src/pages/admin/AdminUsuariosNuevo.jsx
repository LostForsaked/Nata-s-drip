import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validarRequerido, validarCorreo } from '../../utils/validaciones';

export default function AdminUsuariosNuevo() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Vendedor');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!validarRequerido(nombre)) {
      alert("El nombre completo es obligatorio.");
      return;
    }

    if (!validarCorreo(email)) {
      alert("Por favor, ingresa un correo válido (ej: @duoc.cl, @profesor.duoc.cl o @gmail.com).");
      return;
    }

    if (!validarRequerido(password)) {
      alert("La contraseña no puede estar vacía.");
      return;
    }

    // Obtener usuarios actuales del localStorage
    const usuariosGuardados = localStorage.getItem("tienda_usuarios");
    let usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    // Crear nuevo usuario
    const nuevoUsuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      email: email.trim(),
      password: password,
      rol: rol
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("tienda_usuarios", JSON.stringify(usuarios));

    alert("¡Usuario registrado con éxito!");
    navigate('/admin/usuarios');
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
        <header className="admin-header mb-4">
          <h1 className="fw-bold text-dark">Agregar Nuevo Usuario</h1>
        </header>

        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre Completo</label>
              <input 
                type="text" 
                className="form-control" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required 
                placeholder="Ej: Juan Pérez" 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                placeholder="correo@ejemplo.com" 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="******" 
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Rol de Usuario</label>
              <select 
                className="form-select" 
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="Vendedor">Vendedor</option>
                <option value="Cliente">Cliente</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary rounded-pill px-4">Guardar Usuario</button>
              <Link to="/admin/usuarios" className="btn btn-outline-secondary rounded-pill px-4">Cancelar</Link>
            </div>
          </form>
        </div>
      </main>

    </div>
  );
}