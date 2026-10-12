import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  validarCorreo, 
  validarPassword, 
  buscarUsuarioPorCorreo 
} from '../utils/validaciones';
import { iniciarSesion } from '../data/db';

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const [errores, setErrores] = useState({
    correo: '',
    password: ''
  });

  const handleSubmit = (evento) => {
    evento.preventDefault();
    let formularioValido = true;
    let nuevosErrores = { correo: '', password: '' };

    // Validar formato del correo
    if (!validarCorreo(correo)) {
      nuevosErrores.correo = "Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com";
      formularioValido = false;
    }

    // Validar largo de la contraseña
    if (!validarPassword(password)) {
      nuevosErrores.password = "La contraseña debe tener entre 4 y 10 caracteres.";
      formularioValido = false;
    }

    setErrores(nuevosErrores);

    if (formularioValido) {
      // Buscar usuario en el localStorage mediante la utilidad
      const usuario = buscarUsuarioPorCorreo(correo);

      if (!usuario || usuario.password !== password) {
        setErrores((prev) => ({
          ...prev,
          password: "Correo o contraseña incorrectos."
        }));
      } else {
        // Guardar sesión en el localStorage
        iniciarSesion(usuario);

        alert(`¡Bienvenido/a ${usuario.nombre}! Sesión iniciada correctamente.`);

        // Redirección condicional con React Router
        if (usuario.rol === "Administrador" || usuario.rol === "Vendedor") {
          navigate("/admin"); // O la ruta de panel de administración que definas
        } else {
          navigate("/"); // Redirige al inicio/tienda
        }
      }
    }
  };

  return (
    <main className="login-main my-5">
      <div className="login-logo text-center mb-4">
        <img src="img/Logo.jpg" alt="Logo Nata's Drip" width="80" className="rounded mb-2" />
        <h1 className="fw-bold">Nata's Drip</h1>
      </div>

      <section className="login-container container" style={{ maxWidth: '450px' }}>
        <form id="form-login" onSubmit={handleSubmit} noValidate>
          <fieldset className="border p-4 rounded-4 shadow-sm bg-light">
            <legend className="float-none w-auto px-3 fw-bold fs-5">Inicio de sesión</legend>

            <div className="campo mb-3">
              <label htmlFor="correo" className="form-label fw-semibold">Correo</label>
              <input 
                type="email" 
                id="correo" 
                name="correo" 
                maxLength="100" 
                className="form-control"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setErrores({ ...errores, correo: '' });
                }}
                required 
              />
              <span className="error text-danger small">{errores.correo}</span>
            </div>

            <div className="campo mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="form-control"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrores({ ...errores, password: '' });
                }}
                required 
              />
              <span className="error text-danger small">{errores.password}</span>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 rounded-pill fw-semibold">
              Iniciar sesión
            </button>
          </fieldset>
        </form>
      </section>
    </main>
  );
}

export default Login;