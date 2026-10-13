import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerUsuarios, eliminarUsuario, obtenerSesion } from '../../data/db';
import ModalConfirmar from '../../components/ModalConfirmar';

const CLASE_ROL = {
  Administrador: 'bg-danger',
  Vendedor: 'bg-primary',
  Cliente: 'bg-secondary',
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(obtenerUsuarios);
  const [aEliminar, setAEliminar] = useState(null);
  const sesion = obtenerSesion();

  const confirmarEliminar = () => {
    eliminarUsuario(aEliminar.id);
    setUsuarios(obtenerUsuarios());
    setAEliminar(null);
  };

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-dark m-0">Gestión de Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary rounded-pill px-4">
          <i className="bi bi-person-plus-fill me-1"></i> Nuevo Usuario
        </Link>
      </header>

      <section className="card border-0 shadow-sm p-4 rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="fw-semibold">{usuario.id}</td>
                  <td className="fw-bold">{usuario.nombre} {usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span className={'badge ' + (CLASE_ROL[usuario.rol] || 'bg-secondary')}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={String(usuario.id) === String(sesion?.id)}
                      title={String(usuario.id) === String(sesion?.id) ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}
                      onClick={() => setAEliminar(usuario)}
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
          <p className="text-muted text-center py-4 mb-0">Aún no hay usuarios registrados.</p>
        )}
      </section>

      <ModalConfirmar
        show={!!aEliminar}
        titulo="Eliminar usuario"
        mensaje={`¿Eliminar a ${aEliminar?.nombre ?? ''}?`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  );
}