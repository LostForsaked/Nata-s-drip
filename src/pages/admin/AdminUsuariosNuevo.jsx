import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validarRequerido, validarCorreo, validarPassword } from '../../utils/validaciones';
import { crearUsuario } from '../../data/db';

export default function AdminUsuariosNuevo() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Vendedor');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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

    if (!validarPassword(password)) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    // El nombre completo se separa: primera palabra = nombre, el resto = apellidos
    const [primero, ...resto] = nombre.trim().split(/\s+/);

    try {
      await crearUsuario({
        nombre: primero,
        apellidos: resto.join(' '),
        correo: email.trim(),
        password,
        rol,
      });
    } catch (err) {
      alert(err.message);
      return;
    }

    alert("¡Usuario registrado con éxito!");
    navigate('/admin/usuarios');
  };

  return (
    <>
      
      

      {/* Contenido Principal */}
      <div>
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
      </div>

    </>
  );
}