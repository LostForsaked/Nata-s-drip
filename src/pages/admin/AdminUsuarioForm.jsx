import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { regionesComunas } from '../../data/regiones';
import { actualizarUsuario, buscarUsuarioPorId, crearUsuario } from '../../data/db';
import { useCargar } from '../../data/useCargar';
import Cargando, { ErrorCarga } from '../../components/Cargando';
import { validarCorreo, validarPassword, validarRun } from '../../utils/validaciones';
import { useNotificaciones } from '../../context/NotificacionesContext';

const FORMULARIO_INICIAL = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  password: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
  region: '',
  comuna: '',
  rol: 'Vendedor',
};

function fechaLocalHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function validarFormulario(datos, editando) {
  const errores = {};
  const nombre = datos.nombre.trim();
  const apellidos = datos.apellidos.trim();
  const correo = datos.correo.trim();
  const direccion = datos.direccion.trim();

  if (!validarRun(datos.run)) errores.run = 'Ingresa un RUN válido. Ej: 19011022K.';
  if (!nombre) errores.nombre = 'El nombre es obligatorio.';
  else if (nombre.length > 50) errores.nombre = 'Máximo 50 caracteres.';
  if (!apellidos) errores.apellidos = 'Los apellidos son obligatorios.';
  else if (apellidos.length > 100) errores.apellidos = 'Máximo 100 caracteres.';
  if (!validarCorreo(correo)) errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
  else if (correo.length > 100) errores.correo = 'Máximo 100 caracteres.';
  if ((!editando || datos.password) && !validarPassword(datos.password)) {
    errores.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
  }
  if (datos.telefono.trim().length > 15) errores.telefono = 'Máximo 15 caracteres.';
  if (datos.fechaNacimiento && datos.fechaNacimiento >= fechaLocalHoy()) {
    errores.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy.';
  }
  if (!direccion) errores.direccion = 'La dirección es obligatoria.';
  else if (direccion.length > 300) errores.direccion = 'Máximo 300 caracteres.';
  if (!datos.region) errores.region = 'Selecciona una región.';
  if (!datos.comuna) errores.comuna = 'Selecciona una comuna.';
  if (!datos.rol) errores.rol = 'Selecciona un rol.';
  return errores;
}

function datosIniciales(usuario) {
  if (!usuario) return FORMULARIO_INICIAL;
  return {
    run: usuario.run,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    password: '',
    telefono: usuario.telefono,
    fechaNacimiento: usuario.fechaNacimiento,
    direccion: usuario.direccion,
    region: usuario.region,
    comuna: usuario.comuna,
    rol: usuario.rol,
  };
}

export default function AdminUsuarioForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const { datos: usuario, cargando, error, recargar } = useCargar(
    () => editando ? buscarUsuarioPorId(id) : Promise.resolve(null),
    [id],
  );

  if (editando && error) return <ErrorCarga error={error} onReintentar={recargar} />;
  if (editando && cargando) return <Cargando />;
  if (editando && usuario === null) {
    return <p className="alert alert-warning">No se encontró el usuario solicitado.</p>;
  }

  return <FormularioUsuario key={id ?? 'nuevo'} usuario={usuario} />;
}

function FormularioUsuario({ usuario }) {
  const editando = usuario !== null;
  const { notificar } = useNotificaciones();
  const [formulario, setFormulario] = useState(() => datosIniciales(usuario));
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();
  const comunas = regionesComunas[formulario.region] || [];

  const handleChange = ({ target: { name, value } }) => {
    setFormulario((actual) => ({
      ...actual,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {}),
    }));
    setErrores((actual) => ({ ...actual, [name]: '', ...(name === 'region' ? { comuna: '' } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario(formulario, editando);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length) return;

    setGuardando(true);
    try {
      const datos = {
        ...formulario,
        run: formulario.run.trim(),
        nombre: formulario.nombre.trim(),
        apellidos: formulario.apellidos.trim(),
        correo: formulario.correo.trim(),
        telefono: formulario.telefono.trim() || null,
        fechaNacimiento: formulario.fechaNacimiento || null,
        direccion: formulario.direccion.trim(),
      };
      if (editando) await actualizarUsuario(usuario.id, datos);
      else await crearUsuario(datos);
    } catch (err) {
      if (err.campo) setErrores((actual) => ({ ...actual, [err.campo]: err.message }));
      else notificar(err.message, 'danger');
      setGuardando(false);
      return;
    }

    notificar(editando ? 'Usuario actualizado correctamente.' : '¡Usuario registrado con éxito!', 'success');
    navigate('/admin/usuarios');
  };

  const campo = (name, label, { type = 'text', maxLength, placeholder, optional = false, help } = {}) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {label}{optional && <span className="text-muted fw-normal"> (opcional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        maxLength={maxLength}
        className={`form-control ${errores[name] ? 'is-invalid' : ''}`}
        value={formulario[name]}
        onChange={handleChange}
        placeholder={placeholder}
        aria-invalid={Boolean(errores[name])}
        aria-describedby={errores[name] ? `${name}-error` : undefined}
      />
      {help && <div className="form-text">{help}</div>}
      {errores[name] && <div id={`${name}-error`} className="invalid-feedback">{errores[name]}</div>}
    </div>
  );

  return (
    <div>
      <header className="admin-header mb-4">
        <h1 className="fw-bold text-dark">{editando ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h1>
      </header>

      <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} noValidate>
          {campo('run', 'RUN', { maxLength: 12, placeholder: 'Ej: 19011022K' })}
          {campo('nombre', 'Nombre', { maxLength: 50 })}
          {campo('apellidos', 'Apellidos', { maxLength: 100 })}
          {campo('correo', 'Correo Electrónico', { type: 'email', maxLength: 100, placeholder: 'correo@ejemplo.com' })}
          {campo('password', 'Contraseña', {
            type: 'password',
            maxLength: 10,
            optional: editando,
            help: editando ? 'Déjala vacía para conservar la contraseña actual.' : undefined,
          })}
          {campo('telefono', 'Teléfono', { type: 'tel', maxLength: 15, optional: true })}
          {campo('fechaNacimiento', 'Fecha de nacimiento', { type: 'date', optional: true })}
          {campo('direccion', 'Dirección', { maxLength: 300 })}

          <div className="mb-3">
            <label htmlFor="region" className="form-label fw-semibold">Región</label>
            <select
              id="region"
              name="region"
              className={`form-select ${errores.region ? 'is-invalid' : ''}`}
              value={formulario.region}
              onChange={handleChange}
              aria-invalid={Boolean(errores.region)}
            >
              <option value="">Selecciona una región</option>
              {Object.keys(regionesComunas).map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            {errores.region && <div className="invalid-feedback">{errores.region}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="comuna" className="form-label fw-semibold">Comuna</label>
            <select
              id="comuna"
              name="comuna"
              className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
              value={formulario.comuna}
              onChange={handleChange}
              disabled={!formulario.region}
              aria-invalid={Boolean(errores.comuna)}
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((comuna) => <option key={comuna} value={comuna}>{comuna}</option>)}
            </select>
            {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="rol" className="form-label fw-semibold">Rol de Usuario</label>
            <select
              id="rol"
              name="rol"
              className={`form-select ${errores.rol ? 'is-invalid' : ''}`}
              value={formulario.rol}
              onChange={handleChange}
              aria-invalid={Boolean(errores.rol)}
            >
              <option value="Cliente">Cliente</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Administrador">Administrador</option>
            </select>
            {errores.rol && <div className="invalid-feedback">{errores.rol}</div>}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={guardando}>
              {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Guardar Usuario'}
            </button>
            <Link to="/admin/usuarios" className="btn btn-outline-secondary rounded-pill px-4">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
