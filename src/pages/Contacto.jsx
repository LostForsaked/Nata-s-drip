import React, { useState } from 'react';
import { 
  validarNombreContacto, 
  validarComentario, 
  validarCorreo 
} from '../utils/validaciones';

function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [comentario, setComentario] = useState('');

  const [errores, setErrores] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });

  const handleSubmit = (evento) => {
    evento.preventDefault();
    let formularioValido = true;
    let nuevosErrores = { nombre: '', correo: '', comentario: '' };

    if (!validarNombreContacto(nombre)) {
      nuevosErrores.nombre = "El nombre es obligatorio (máx. 100 caracteres).";
      formularioValido = false;
    }

    if (correo.trim() !== "" && !validarCorreo(correo)) {
      nuevosErrores.correo = "Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com";
      formularioValido = false;
    }

    if (!validarComentario(comentario)) {
      nuevosErrores.comentario = "El comentario es obligatorio (máx. 500 caracteres).";
      formularioValido = false;
    }

    setErrores(nuevosErrores);

    if (formularioValido) {
      alert(`¡Gracias ${nombre}! Tu mensaje fue enviado.`);
      setNombre('');
      setCorreo('');
      setComentario('');
      setErrores({ nombre: '', correo: '', comentario: '' });
    }
  };

  return (
    <main className="contacto-main my-5">
      <div className="contacto-logo text-center mb-4">
        <img src="img/Logo.jpg" alt="Logo Nata's Drip" width="80" className="rounded mb-2" />
        <h1 className="fw-bold">Nata's Drip</h1>
      </div>

      <section className="contacto-container container" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="border p-4 rounded-4 shadow-sm bg-light">
            <legend className="float-none w-auto px-3 fw-bold fs-5">Formulario de contactos</legend>

            <div className="campo mb-3">
              <label htmlFor="nombre" className="form-label fw-semibold">Nombre completo</label>
              <input 
                type="text" 
                name="nombre" 
                id="nombre" 
                maxLength="100" 
                className="form-control"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrores({ ...errores, nombre: '' });
                }}
                required 
              />
              <span className="error text-danger small">{errores.nombre}</span>
            </div>

            <div className="campo mb-3">
              <label htmlFor="correo" className="form-label fw-semibold">Correo</label>
              <input 
                type="email" 
                name="correo" 
                id="correo" 
                maxLength="100" 
                className="form-control"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setErrores({ ...errores, correo: '' });
                }}
              />
              <span className="error text-danger small">{errores.correo}</span>
            </div>

            <div className="campo mb-4">
              <label htmlFor="comentario" className="form-label fw-semibold">Comentario</label>
              <textarea 
                name="comentario" 
                id="comentario" 
                maxLength="500" 
                rows="5" 
                className="form-control"
                value={comentario}
                onChange={(e) => {
                  setComentario(e.target.value);
                  setErrores({ ...errores, comentario: '' });
                }}
                required
              ></textarea>
              <span className="error text-danger small">{errores.comentario}</span>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 rounded-pill fw-semibold">
              Enviar mensaje
            </button>
          </fieldset>
        </form>
      </section>
    </main>
  );
}

export default Contacto;