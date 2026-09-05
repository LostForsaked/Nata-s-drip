// Regiones y comunas //
const regionesComunas = {
    "Región de Arica y Parinacota": [
        "Arica",
        "Camarones",
        "General Lagos",
        "Putre"
    ],

    "Región de Tarapacá": [
        "Alto Hospicio",
        "Camiña",
        "Colchane",
        "Huara",
        "Iquique",
        "Pica",
        "Pozo Almonte"
    ],

    "Región de Antofagasta": [
        "Antofagasta",
        "Calama",
        "María Elena",
        "Mejillones",
        "Ollagüe",
        "San Pedro de Atacama",
        "Sierra Gorda",
        "Taltal",
        "Tocopilla"
    ],

    "Región de Atacama": [
        "Alto del Carmen",
        "Caldera",
        "Chañaral",
        "Copiapó",
        "Diego de Almagro",
        "Freirina",
        "Huasco",
        "Tierra Amarilla",
        "Vallenar"
    ],

    "Región de Coquimbo": [
        "Andacollo",
        "Canela",
        "Combarbalá",
        "Coquimbo",
        "Illapel",
        "La Higuera",
        "La Serena",
        "Los Vilos",
        "Monte Patria",
        "Ovalle",
        "Paiguano",
        "Punitaqui",
        "Río Hurtado",
        "Salamanca",
        "Vicuña"
    ],

    "Región de Valparaíso": [
        "Algarrobo",
        "Cabildo",
        "Calle Larga",
        "Cartagena",
        "Casablanca",
        "Catemu",
        "Concón",
        "El Quisco",
        "El Tabo",
        "Hijuelas",
        "Isla de Pascua",
        "Juan Fernández",
        "La Calera",
        "La Cruz",
        "La Ligua",
        "Limache",
        "Llaillay",
        "Los Andes",
        "Nogales",
        "Olmué",
        "Panquehue",
        "Papudo",
        "Petorca",
        "Puchuncaví",
        "Putaendo",
        "Quillota",
        "Quilpué",
        "Quintero",
        "Rinconada",
        "San Antonio",
        "San Esteban",
        "San Felipe",
        "Santa María",
        "Santo Domingo",
        "Valparaíso",
        "Villa Alemana",
        "Viña del Mar",
        "Zapallar"
    ],

    "Región Metropolitana de Santiago": [
        "Alhué",
        "Buin",
        "Calera de Tango",
        "Cerrillos",
        "Cerro Navia",
        "Colina",
        "Conchalí",
        "Curacaví",
        "El Bosque",
        "El Monte",
        "Estación Central",
        "Huechuraba",
        "Independencia",
        "Isla de Maipo",
        "La Cisterna",
        "La Florida",
        "La Granja",
        "Lampa",
        "La Pintana",
        "La Reina",
        "Las Condes",
        "Lo Barnechea",
        "Lo Espejo",
        "Lo Prado",
        "Macul",
        "Maipú",
        "María Pinto",
        "Melipilla",
        "Ñuñoa",
        "Padre Hurtado",
        "Paine",
        "Pedro Aguirre Cerda",
        "Peñaflor",
        "Peñalolén",
        "Pirque",
        "Providencia",
        "Pudahuel",
        "Puente Alto",
        "Quilicura",
        "Quinta Normal",
        "Recoleta",
        "Renca",
        "San Bernardo",
        "San Joaquín",
        "San José de Maipo",
        "San Miguel",
        "San Pedro",
        "San Ramón",
        "Santiago",
        "Talagante",
        "Tiltil",
        "Vitacura"
    ],

    "Región de O'Higgins": [
        "Chépica",
        "Chimbarongo",
        "Codegua",
        "Coinco",
        "Coltauco",
        "Doñihue",
        "Graneros",
        "La Estrella",
        "Las Cabras",
        "Litueche",
        "Lolol",
        "Machalí",
        "Malloa",
        "Marchihue",
        "Mostazal",
        "Nancagua",
        "Navidad",
        "Olivar",
        "Palmilla",
        "Paredones",
        "Peralillo",
        "Peumo",
        "Pichidegua",
        "Pichilemu",
        "Placilla",
        "Pumanque",
        "Quinta de Tilcoco",
        "Rancagua",
        "Rengo",
        "Requínoa",
        "San Fernando",
        "San Vicente",
        "Santa Cruz"
    ],

    "Región del Maule": [
        "Cauquenes",
        "Chanco",
        "Colbún",
        "Constitución",
        "Curepto",
        "Curicó",
        "Empedrado",
        "Hualañé",
        "Licantén",
        "Linares",
        "Longaví",
        "Maule",
        "Molina",
        "Parral",
        "Pelarco",
        "Pelluhue",
        "Pencahue",
        "Rauco",
        "Retiro",
        "Río Claro",
        "Romeral",
        "Sagrada Familia",
        "San Clemente",
        "San Javier",
        "San Rafael",
        "Talca",
        "Teno",
        "Vichuquén",
        "Villa Alegre",
        "Yerbas Buenas"
    ],

    "Región de Ñuble": [
        "Bulnes",
        "Chillán",
        "Chillán Viejo",
        "Cobquecura",
        "Coelemu",
        "Coihueco",
        "El Carmen",
        "Ninhue",
        "Ñiquén",
        "Pemuco",
        "Pinto",
        "Portezuelo",
        "Quillón",
        "Quirihue",
        "Ránquil",
        "San Carlos",
        "San Fabián",
        "San Ignacio",
        "San Nicolás",
        "Treguaco",
        "Yungay"
    ],

    "Región del Biobío": [
        "Alto Biobío",
        "Antuco",
        "Arauco",
        "Cabrero",
        "Cañete",
        "Chiguayante",
        "Concepción",
        "Contulmo",
        "Coronel",
        "Curanilahue",
        "Florida",
        "Hualpén",
        "Hualqui",
        "Laja",
        "Lebu",
        "Los Álamos",
        "Los Ángeles",
        "Lota",
        "Mulchén",
        "Nacimiento",
        "Negrete",
        "Penco",
        "Quilaco",
        "Quilleco",
        "San Pedro de la Paz",
        "San Rosendo",
        "Santa Bárbara",
        "Santa Juana",
        "Talcahuano",
        "Tirúa",
        "Tomé",
        "Tucapel",
        "Yumbel"
    ],

    "Región de La Araucanía": [
        "Angol",
        "Carahue",
        "Cholchol",
        "Collipulli",
        "Cunco",
        "Curacautín",
        "Curarrehue",
        "Ercilla",
        "Freire",
        "Galvarino",
        "Gorbea",
        "Lautaro",
        "Loncoche",
        "Lonquimay",
        "Los Sauces",
        "Lumaco",
        "Melipeuco",
        "Nueva Imperial",
        "Padre Las Casas",
        "Perquenco",
        "Pitrufquén",
        "Pucón",
        "Purén",
        "Renaico",
        "Saavedra",
        "Temuco",
        "Teodoro Schmidt",
        "Toltén",
        "Traiguén",
        "Victoria",
        "Vilcún",
        "Villarrica"
    ],

    "Región de Los Ríos": [
        "Corral",
        "Futrono",
        "La Unión",
        "Lago Ranco",
        "Lanco",
        "Los Lagos",
        "Máfil",
        "Mariquina",
        "Paillaco",
        "Panguipulli",
        "Río Bueno",
        "Valdivia"
    ],

    "Región de Los Lagos": [
        "Ancud",
        "Calbuco",
        "Castro",
        "Chaitén",
        "Chonchi",
        "Cochamó",
        "Curaco de Vélez",
        "Dalcahue",
        "Fresia",
        "Frutillar",
        "Futaleufú",
        "Hualaihué",
        "Llanquihue",
        "Los Muermos",
        "Maullín",
        "Osorno",
        "Palena",
        "Puerto Montt",
        "Puerto Octay",
        "Puerto Varas",
        "Puqueldón",
        "Purranque",
        "Puyehue",
        "Queilén",
        "Quellón",
        "Quemchi",
        "Quinchao",
        "Río Negro",
        "San Juan de la Costa",
        "San Pablo"
    ],

    "Región de Aysén del General Carlos Ibáñez del Campo": [
        "Aysén",
        "Chile Chico",
        "Cisnes",
        "Cochrane",
        "Coyhaique",
        "Guaitecas",
        "Lago Verde",
        "O'Higgins",
        "Río Ibáñez",
        "Tortel"
    ],

    "Región de Magallanes y de la Antártica Chilena": [
        "Antártica",
        "Cabo de Hornos",
        "Laguna Blanca",
        "Natales",
        "Porvenir",
        "Primavera",
        "Punta Arenas",
        "Río Verde",
        "San Gregorio",
        "Timaukel",
        "Torres del Paine"
    ]
};
function cargarRegiones(){
    const selectRegion = document.getElementById("region");
    for (const region in regionesComunas) {
        const option = document.createElement("option");
        option.value= region;
        option.textContent = region;
        selectRegion.appendChild(option)
    }
}

function cargarComunas(region){
    const selectComuna = document.getElementById("comuna");
    selectComuna.innerHTML = '<option value ="">-- Seleccione la comuna --</option>';

    if (regionesComunas[region]){
        regionesComunas[region].forEach(comuna=>{
            const option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            selectComuna.appendChild(option);
        });
    }
}
document.addEventListener("DOMContentLoaded", cargarRegiones);

document.getElementById("region").addEventListener("change", function () {
  cargarComunas(this.value);
});

// Validaciones campos registro //
function validarNombre(nombre) {
  return nombre.trim().length > 0 && nombre.trim().length <= 50;
}

function validarApellidos(apellidos) {
  return apellidos.trim().length > 0 && apellidos.trim().length <= 100;
}

function validarPassword(password) {
  return password.length >= 4 && password.length <= 10;
}

function validarDireccion(direccion) {
  return direccion.trim().length > 0 && direccion.trim().length <= 300;
}

// boton de registro
document.getElementById("form-registro").addEventListener("submit", function (evento) {
  evento.preventDefault();

  let formularioValido = true;

  const run = document.getElementById("run").value;
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const region = document.getElementById("region").value;
  const comuna = document.getElementById("comuna").value;
  const direccion = document.getElementById("direccion").value;

  // Limpiar campos
  ["run", "nombre", "apellidos", "correo", "password", "password2", "direccion"]
    .forEach(id => limpiarError(`error-${id}`));

  if (!validarRun(run)) {
    mostrarError("error-run", "RUN inválido. Ej: 19011022K");
    formularioValido = false;
  }

  if (!validarNombre(nombre)) {
    mostrarError("error-nombre", "El nombre es obligatorio (máx. 50 caracteres).");
    formularioValido = false;
  }

  if (!validarApellidos(apellidos)) {
    mostrarError("error-apellidos", "Los apellidos son obligatorios (máx. 100 caracteres).");
    formularioValido = false;
  }

  if (!validarCorreo(correo)) {
    mostrarError("error-correo", "Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com");
    formularioValido = false;
  }

  if (!validarPassword(password)) {
    mostrarError("error-password", "La contraseña debe tener entre 4 y 10 caracteres.");
    formularioValido = false;
  }

  if (password !== password2) {
    mostrarError("error-password2", "Las contraseñas no coinciden.");
    formularioValido = false;
  }

  if (!validarDireccion(direccion)) {
    mostrarError("error-direccion", "La dirección es obligatoria (máx. 300 caracteres).");
    formularioValido = false;
  }

  if (!region || !comuna) {
    alert("Debes seleccionar región y comuna.");
    formularioValido = false;
  }

  if (formularioValido) {
    alert("¡Registro exitoso! Bienvenido/a " + nombre);
    // Aquí después podrían guardar el usuario en localStorage si lo necesitan
    document.getElementById("form-registro").reset();
    cargarComunas(""); // limpia el select de comuna
  }
});
// ===== Limpiar errores mientras el usuario escribe =====
const camposConError = ["run", "nombre", "apellidos", "correo", "password", "password2", "direccion"];

camposConError.forEach(id => {
  const campo = document.getElementById(id);
  campo.addEventListener("input", () => {
    limpiarError(`error-${id}`);
  });
});