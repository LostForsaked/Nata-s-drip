import { useState } from 'react';
import {
  obtenerCategorias, crearCategoria, actualizarCategoria,
  eliminarCategoria, obtenerProductos,
} from '../../data/db';
import ModalConfirmar from '../../components/ModalConfirmar';
import { useCargar } from '../../data/useCargar';
import Cargando, { ErrorCarga } from '../../components/Cargando';


export default function AdminCategorias() {
  const { datos, error: errorCarga, recargar } = useCargar(
    () => Promise.all([obtenerCategorias(), obtenerProductos()]),
    []
  );
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  if (errorCarga) return <ErrorCarga error={errorCarga} onReintentar={recargar} />;
  if (!datos) return <Cargando />;
  const [categorias, productos] = datos;

  const cuantos = (id) =>
    productos.filter((p) => String(p.categoriaId) === String(id)).length;

  const limpiarForm = () => { setNombre(''); setEditandoId(null); setError(''); };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) return setError('El nombre es obligatorio.');
    if (limpio.length > 50) return setError('Máximo 50 caracteres.');
    const repetida = categorias.some(
      (c) => c.nombre.toLowerCase() === limpio.toLowerCase() &&
             String(c.id) !== String(editandoId)
    );
    if (repetida) return setError('Ya existe una categoría con ese nombre.');

    try {
      if (editandoId) await actualizarCategoria(editandoId, limpio);
      else await crearCategoria(limpio);
    } catch (err) {
      return setError(err.message);
    }
    limpiarForm();
    recargar();
  };

  const handleEditar = (c) => { setEditandoId(c.id); setNombre(c.nombre); setError(''); };

  const confirmarEliminar = async () => {
    if (!aEliminar) return;

    try {
      const ok = await eliminarCategoria(aEliminar.id); // false si tiene productos
      if (!ok) setError('No puedes eliminar una categoría que tiene productos.');
    } catch (err) {
      setError(err.message);
    }
    setAEliminar(null);
    recargar();
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