import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  validarRun, 
  validarCorreo, 
  validarPassword, 
  buscarUsuarioPorCorreo, 
  guardarUsuarios 
} from '../utils/validaciones';
import { regionesComunas } from '../data/regiones';


function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    password2: '',
    telefono: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    password2: '',
    direccion: ''
  });

  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  const validarNombre = (val) => val.trim().length > 0 && val.trim().length <= 50;
  const validarApellidos = (val) => val.trim().length > 0 && val.trim().length <= 100;
  const validarDireccion = (val) => val.trim().length > 0 && val.trim().length <= 300;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrores({ ...errores, [name]: '' });

    // Si cambia la región, actualizamos las comunas
    if (name === 'region') {
      setComunasDisponibles(regionesComunas[value] || []);
      setFormData(prev => ({ ...prev, region: value, comuna: '' }));
    }
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();
    let formularioValido = true;
    let nuevosErrores = { run: '', nombre: '', apellidos: '', correo: '', password: '', password2: '', direccion: '' };

    if (!validarRun(formData.run)) {
      nuevosErrores.run = "RUN inválido. Ej: 19011022K";
      formularioValido = false;
    }

    if (!validarNombre(formData.nombre)) {
      nuevosErrores.nombre = "El nombre es obligatorio (máx. 50 caracteres).";
      formularioValido = false;
    }

    if (!validarApellidos(formData.apellidos)) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios (máx. 100 caracteres).";
      formularioValido = false;
    }

    if (!validarCorreo(formData.correo)) {
      nuevosErrores.correo = "Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com";
      formularioValido = false;
    }

    if (!validarPassword(formData.password)) {
      nuevosErrores.password = "La contraseña debe tener entre 4 y 10 caracteres.";
      formularioValido = false;
    }

    if (formData.password !== formData.password2) {
      nuevosErrores.password2 = "Las contraseñas no coinciden.";
      formularioValido = false;
    }

    if (!validarDireccion(formData.direccion)) {
      nuevosErrores.direccion = "La dirección es obligatoria (máx. 300 caracteres).";
      formularioValido = false;
    }

    if (!formData.region || !formData.comuna) {
      alert("Debes seleccionar región y comuna.");
      formularioValido = false;
    }

    if (formularioValido && buscarUsuarioPorCorreo(formData.correo)) {
      nuevosErrores.correo = "Este correo ya está registrado.";
      formularioValido = false;
    }

    setErrores(nuevosErrores);

    if (formularioValido) {
      const nuevoUsuario = {
        run: formData.run,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        password: formData.password,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        region: formData.region,
        comuna: formData.comuna,
        direccion: formData.direccion,
        rol: "Cliente"
      };

      guardarUsuarios(nuevoUsuario);
      alert("¡Registro exitoso! Bienvenido/a " + formData.nombre);
      navigate("/login"); // Redirige al login tras registrarse con éxito
    }
  };

  return (
    <main className="registro-main my-5">
      <section className="registro-container container" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="border p-4 rounded-4 shadow-sm bg-light">
            <legend className="float-none w-auto px-3 fw-bold fs-5">Registro de usuario</legend>

            <div className="campo mb-3">
              <label htmlFor="run" className="form-label fw-semibold">Run</label>
              <input type="text" id="run" name="run" placeholder="Ej: 21243933K" maxLength="9" className="form-control" value={formData.run} onChange={handleChange} required />
              <span className="error text-danger small">{errores.run}</span>
            </div>

            <div className="campo mb-3">
              <label htmlFor="nombre" className="form-label fw-semibold">Nombre</label>
              <input type="text" id="nombre" name="nombre" maxLength="50" className="form-control" value={formData.nombre} onChange={handleChange} required />
              <span className="error text-danger small">{errores.nombre}</span>
            </div>

            <div className="campo mb-3">
              <label htmlFor="apellidos" className="form-label fw-semibold">Apellidos</label>
              <input type="text" id="apellidos" name="apellidos" maxLength="100" className="form-control" value={formData.apellidos} onChange={handleChange} required />
              <span className="error text-danger small">{errores.apellidos}</span>
            </div>

            <div className="campo mb-3">
              <label htmlFor="correo" className="form-label fw-semibold">Correo</label>
              <input type="email" id="correo" name="correo" maxLength="100" className="form-control" value={formData.correo} onChange={handleChange} required />
              <span className="error text-danger small">{errores.correo}</span>
            </div>

            <div className="campo mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
              <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
              <span className="error text-danger small">{errores.password}</span>
            </div>

            <div className="campo mb-3">
              <label htmlFor="password2" className="form-label fw-semibold">Confirmar Contraseña</label>
              <input type="password" id="password2" name="password2" className="form-control" value={formData.password2} onChange={handleChange} required />
              <span className="error text-danger small">{errores.password2}</span>
            </div>

            <div className="campo mb-3">
              <label htmlFor="telefono" className="form-label fw-semibold">Teléfono (opcional)</label>
              <input type="tel" id="telefono" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
            </div>

            <div className="campo mb-3">
              <label htmlFor="fecha-nacimiento" className="form-label fw-semibold">Fecha de nacimiento</label>
              <input type="date" id="fecha-nacimiento" name="fechaNacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} />
            </div>

            <div className="campo mb-3">
              <label htmlFor="region" className="form-label fw-semibold">Región</label>
              <select id="region" name="region" className="form-select" value={formData.region} onChange={handleChange} required>
                <option value="">--- Seleccione la región ---</option>
                {Object.keys(regionesComunas).map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <div className="campo mb-3">
              <label htmlFor="comuna" className="form-label fw-semibold">Comuna</label>
              <select id="comuna" name="comuna" className="form-select" value={formData.comuna} onChange={handleChange} required>
                <option value="">--- Seleccione la comuna ---</option>
                {comunasDisponibles.map((com) => (
                  <option key={com} value={com}>{com}</option>
                ))}
              </select>
            </div>

            <div className="campo mb-4">
              <label htmlFor="direccion" className="form-label fw-semibold">Dirección</label>
              <input type="text" id="direccion" name="direccion" maxLength="300" className="form-control" value={formData.direccion} onChange={handleChange} required />
              <span className="error text-danger small">{errores.direccion}</span>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 rounded-pill fw-semibold">
              Registrar
            </button>
          </fieldset>
        </form>
      </section>
    </main>
  );
}

export default Registro;