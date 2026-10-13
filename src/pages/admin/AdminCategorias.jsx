import { useState } from 'react';
import {
  obtenerCategorias, crearCategoria, actualizarCategoria,
  eliminarCategoria, obtenerProductos,
} from '../../data/db';
import ModalConfirmar from '../../components/ModalConfirmar';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState(obtenerCategorias);
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  const refrescar = () => setCategorias(obtenerCategorias());
  const cuantos = (id) =>
    obtenerProductos().filter((p) => String(p.categoriaId) === String(id)).length;

  const limpiarForm = () => { setNombre(''); setEditandoId(null); setError(''); };

  const handleGuardar = (e) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) return setError('El nombre es obligatorio.');
    if (limpio.length > 50) return setError('Máximo 50 caracteres.');
    const repetida = categorias.some(
      (c) => c.nombre.toLowerCase() === limpio.toLowerCase() &&
             String(c.id) !== String(editandoId)
    );
    if (repetida) return setError('Ya existe una categoría con ese nombre.');

    if (editandoId) actualizarCategoria(editandoId, limpio);
    else crearCategoria(limpio);
    limpiarForm();
    refrescar();
  };

  const handleEditar = (c) => { setEditandoId(c.id); setNombre(c.nombre); setError(''); };

  const confirmarEliminar = () => {
    if (!aEliminar) return;

    const ok = eliminarCategoria(aEliminar.id); // false si tiene productos
    if (!ok) setError('No puedes eliminar una categoría que tiene productos.');
    setAEliminar(null);
    refrescar();
  };

  return (
    <>
      <h1 className="fw-bold mb-4">Categorías</h1>

      <form onSubmit={handleGuardar} className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <label htmlFor="nombreCat" className="form-label fw-semibold">
          {editandoId ? 'Editar categoría' : 'Nueva categoría'}
        </label>
        <div className="d-flex gap-2">
          <input
            id="nombreCat"
            className={'form-control ' + (error ? 'is-invalid' : '')}
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError(''); }}
          />
          <button className="btn btn-primary" type="submit">
            {editandoId ? 'Actualizar' : 'Crear'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn-outline-secondary" onClick={limpiarForm}>
              Cancelar
            </button>
          )}
        </div>
        {error && <div className="text-danger small mt-2">{error}</div>}
      </form>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr><th>ID</th><th>Nombre</th><th>Productos</th><th className="text-end">Acciones</th></tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td className="fw-semibold">{c.nombre}</td>
                <td>{cuantos(c.id)}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(c)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setAEliminar(c)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalConfirmar
        show={!!aEliminar}
        titulo="Eliminar categoría"
        mensaje={`¿Eliminar "${aEliminar?.nombre}"?`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  );
}