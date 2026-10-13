import { useState } from 'react';
import { regionesComunas } from '../../data/regiones';
import {
  obtenerSesion, buscarUsuarioPorId, actualizarUsuario, iniciarSesion,
} from '../../data/db';
import { validarRequerido, validarPassword } from '../../utils/validaciones';

function Campo({ id, label, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">{label}</label>
      {children}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}

export default function AdminPerfil() {
  const usuario = buscarUsuarioPorId(obtenerSesion()?.id);

  const [form, setForm] = useState(() => ({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    telefono: usuario?.telefono ?? '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    direccion: usuario?.direccion ?? '',
  }));
  const [pass, setPass] = useState({ actual: '', nueva: '', repetir: '' });
  const [errDatos, setErrDatos] = useState({});
  const [errPass, setErrPass] = useState({});
  const [mensaje, setMensaje] = useState(null);

  if (!usuario) {
    return <p>No se encontró tu cuenta. Vuelve a iniciar sesión.</p>;
  }

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === 'region' ? { comuna: '' } : {}) }));
  };

  const claseInput = (err) => 'form-control ' + (err ? 'is-invalid' : '');

  const guardarDatos = (e) => {
    e.preventDefault();
    const err = {};
    if (!validarRequerido(form.nombre)) err.nombre = 'El nombre es obligatorio.';
    if (!validarRequerido(form.apellidos)) err.apellidos = 'Los apellidos son obligatorios.';
    if (form.telefono.trim() && !/^\+?\d{8,12}$/.test(form.telefono.trim()))
      err.telefono = 'Teléfono inválido (8 a 12 dígitos).';
    if (!form.region) err.region = 'Selecciona una región.';
    if (!form.comuna) err.comuna = 'Selecciona una comuna.';
    if (!validarRequerido(form.direccion)) err.direccion = 'La dirección es obligatoria.';
    setErrDatos(err);
    if (Object.keys(err).length) return;

    actualizarUsuario(usuario.id, {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      telefono: form.telefono.trim(),
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
    });
    iniciarSesion(buscarUsuarioPorId(usuario.id)); // refresca la sesión (sin password)
    setMensaje({ tipo: 'success', texto: 'Perfil actualizado.' });
  };

  const cambiarPassword = (e) => {
    e.preventDefault();
    const err = {};
    if (pass.actual !== usuario.password) err.actual = 'La contraseña actual no coincide.';
    if (!validarPassword(pass.nueva)) err.nueva = 'Debe tener entre 4 y 10 caracteres.';
    if (pass.nueva !== pass.repetir) err.repetir = 'Las contraseñas no coinciden.';
    setErrPass(err);
    if (Object.keys(err).length) return;

    actualizarUsuario(usuario.id, { password: pass.nueva });
    setPass({ actual: '', nueva: '', repetir: '' });
    setMensaje({ tipo: 'success', texto: 'Contraseña actualizada.' });
  };

  return (
    <>
      <h1 className="fw-bold mb-4">Mi perfil</h1>
      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">{mensaje.texto}</div>
      )}

      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={guardarDatos} className="card border-0 shadow-sm rounded-4 p-4" noValidate>
            <h2 className="h5 fw-bold mb-3">Mis datos</h2>
            <p className="text-muted small">
              {usuario.correo} · <span className="badge bg-secondary">{usuario.rol}</span>
            </p>

            <div className="row">
              <div className="col-md-6">
                <Campo id="nombre" label="Nombre" error={errDatos.nombre}>
                  <input id="nombre" name="nombre" className={claseInput(errDatos.nombre)}
                    value={form.nombre} onChange={cambiar} />
                </Campo>
              </div>
              <div className="col-md-6">
                <Campo id="apellidos" label="Apellidos" error={errDatos.apellidos}>
                  <input id="apellidos" name="apellidos" className={claseInput(errDatos.apellidos)}
                    value={form.apellidos} onChange={cambiar} />
                </Campo>
              </div>
            </div>

            <Campo id="telefono" label="Teléfono (opcional)" error={errDatos.telefono}>
              <input id="telefono" name="telefono" className={claseInput(errDatos.telefono)}
                value={form.telefono} onChange={cambiar} />
            </Campo>

            <div className="row">
              <div className="col-md-6">
                <Campo id="region" label="Región" error={errDatos.region}>
                  <select id="region" name="region" className={'form-select ' + (errDatos.region ? 'is-invalid' : '')}
                    value={form.region} onChange={cambiar}>
                    <option value="">Selecciona…</option>
                    {Object.keys(regionesComunas).map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Campo>
              </div>
              <div className="col-md-6">
                <Campo id="comuna" label="Comuna" error={errDatos.comuna}>
                  <select id="comuna" name="comuna" className={'form-select ' + (errDatos.comuna ? 'is-invalid' : '')}
                    value={form.comuna} onChange={cambiar} disabled={!form.region}>
                    <option value="">Selecciona…</option>
                    {(regionesComunas[form.region] || []).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Campo>
              </div>
            </div>

            <Campo id="direccion" label="Dirección" error={errDatos.direccion}>
              <input id="direccion" name="direccion" className={claseInput(errDatos.direccion)}
                value={form.direccion} onChange={cambiar} />
            </Campo>

            <button className="btn btn-primary align-self-start" type="submit">Guardar cambios</button>
          </form>
        </div>

        <div className="col-lg-5">
          <form onSubmit={cambiarPassword} className="card border-0 shadow-sm rounded-4 p-4" noValidate>
            <h2 className="h5 fw-bold mb-3">Cambiar contraseña</h2>
            {[
              ['actual', 'Contraseña actual'],
              ['nueva', 'Nueva contraseña'],
              ['repetir', 'Repetir nueva contraseña'],
            ].map(([campo, label]) => (
              <Campo key={campo} id={'pw-' + campo} label={label} error={errPass[campo]}>
                <input id={'pw-' + campo} type="password" className={claseInput(errPass[campo])}
                  value={pass[campo]}
                  onChange={(e) => setPass((p) => ({ ...p, [campo]: e.target.value }))} />
              </Campo>
            ))}
            <button className="btn btn-dark align-self-start" type="submit">Actualizar contraseña</button>
          </form>
        </div>
      </div>
    </>
  );
}