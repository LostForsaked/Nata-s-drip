import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  validarRun, 
  validarCorreo, 
  validarPassword, 
  buscarUsuarioPorCorreo, 
  guardarUsuarios 
} from '../utils/validaciones';

// Diccionario de regiones y comunas
const regionesComunas = {
    "Región de Arica y Parinacota": [
        "Arica", "Camarones", "General Lagos", "Putre"
    ],
    "Región de Tarapacá": [
        "Alto Hospicio", "Camiña", "Colchane", "Huara", "Iquique", "Pica", "Pozo Almonte"
    ],
    "Región de Antofagasta": [
        "Antofagasta", "Calama", "María Elena", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla"
    ],
    "Región de Atacama": [
        "Alto del Carmen", "Caldera", "Chañaral", "Copiapó", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Vallenar"
    ],
    "Región de Coquimbo": [
        "Andacollo", "Canela", "Combarbalá", "Coquimbo", "Illapel", "La Higuera", "La Serena", "Los Vilos", "Monte Patria", "Ovalle", "Paiguano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"
    ],
    "Región de Valparaíso": [
        "Algarrobo", "Cabildo", "Calle Larga", "Cartagena", "Casablanca", "Catemu", "Concón", "El Quisco", "El Tabo", "Hijuelas", "Isla de Pascua", "Juan Fernández", "La Calera", "La Cruz", "La Ligua", "Limache", "Llaillay", "Los Andes", "Nogales", "Olmué", "Panquehue", "Papudo", "Petorca", "Puchuncaví", "Putaendo", "Quillota", "Quilpué", "Quintero", "Rinconada", "San Antonio", "San Esteban", "San Felipe", "Santa María", "Santo Domingo", "Valparaíso", "Villa Alemana", "Viña del Mar", "Zapallar"
    ],
    "Región Metropolitana de Santiago": [
        "Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "Lampa", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago", "Talagante", "Tiltil", "Vitacura"
    ],
    "Región de O'Higgins": [
        "Chépica", "Chimbarongo", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "La Estrella", "Las Cabras", "Litueche", "Lolol", "Machalí", "Malloa", "Marchihue", "Mostazal", "Nancagua", "Navidad", "Olivar", "Palmilla", "Paredones", "Peralillo", "Peumo", "Pichidegua", "Pichilemu", "Placilla", "Pumanque", "Quinta de Tilcoco", "Rancagua", "Rengo", "Requínoa", "San Fernando", "San Vicente", "Santa Cruz"
    ],
    "Región del Maule": [
        "Cauquenes", "Chanco", "Colbún", "Constitución", "Curepto", "Curicó", "Empedrado", "Hualañé", "Licantén", "Linares", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pelluhue", "Pencahue", "Rauco", "Retiro", "Río Claro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Talca", "Teno", "Vichuquén", "Villa Alegre", "Yerbas Buenas"
    ],
    "Región de Ñuble": [
        "Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"
    ],
    "Región del Biobío": [
        "Alto Biobío", "Antuco", "Arauco", "Cabrero", "Cañete", "Chiguayante", "Concepción", "Contulmo", "Coronel", "Curanilahue", "Florida", "Hualpén", "Hualqui", "Laja", "Lebu", "Los Álamos", "Los Ángeles", "Lota", "Mulchén", "Nacimiento", "Negrete", "Penco", "Quilaco", "Quilleco", "San Pedro de la Paz", "San Rosendo", "Santa Bárbara", "Santa Juana", "Talcahuano", "Tirúa", "Tomé", "Tucapel", "Yumbel"
    ],
    "Región de La Araucanía": [
        "Angol", "Carahue", "Cholchol", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Purén", "Renaico", "Saavedra", "Temuco", "Teodoro Schmidt", "Toltén", "Traiguén", "Victoria", "Vilcún", "Villarrica"
    ],
    "Región de Los Ríos": [
        "Corral", "Futrono", "La Unión", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno", "Valdivia"
    ],
    "Región de Los Lagos": [
        "Ancud", "Calbuco", "Castro", "Chaitén", "Chonchi", "Cochamó", "Curaco de Vélez", "Dalcahue", "Fresia", "Frutillar", "Futaleufú", "Hualaihué", "Llanquihue", "Los Muermos", "Maullín", "Osorno", "Palena", "Puerto Montt", "Puerto Octay", "Puerto Varas", "Puqueldón", "Purranque", "Puyehue", "Queilén", "Quellón", "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo"
    ],
    "Región de Aysén del General Carlos Ibáñez del Campo": [
        "Aysén", "Chile Chico", "Cisnes", "Cochrane", "Coyhaique", "Guaitecas", "Lago Verde", "O'Higgins", "Río Ibáñez", "Tortel"
    ],
    "Región de Magallanes y de la Antártica Chilena": [
        "Antártica", "Cabo de Hornos", "Laguna Blanca", "Natales", "Porvenir", "Primavera", "Punta Arenas", "Río Verde", "San Gregorio", "Timaukel", "Torres del Paine"
    ]
};

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
                {Object.keys(regionesComunas.default || regionesComunas).map((reg) => (
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