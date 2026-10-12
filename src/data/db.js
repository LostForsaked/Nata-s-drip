export const DB_KEYS = {
    productos: "nd_productos",
    categorias: "nd_categorias",
    usuarios: "nd_usuarios",
    ordenes: "nd_ordenes",
    sesion: "usuario_sesion",
    carrito: "mi_carrito",
};

function leer(clave, porDefecto = []) {
    try{
        const raw = localStorage.getItem(clave);
        return raw ? JSON.parse(raw) : porDefecto;
    } catch {
        return porDefecto;
    }
}

function escribir(clave, datos){
    localStorage.setItem(clave, JSON.stringify(datos));
    window.dispatchEvent(new Event("dbActualizada"));
}

function siguienteId(lista) {
    return lista.length
    ? Math.max(...lista.map((x) => Number(x.id) || 0)) +1
    : 1;
}

//Datos iniciales

const CATEGORIAS_INICIALES =[
    {id:1, nombre: "Memes"},
    {id:2, nombre: "Bandas"},
    {id:3, nombre: "Cine y series"},
];

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Afraid of Women", descripcion: "Polera negra con estampado de lobo", imagen: "/img/poleraLobo.avif", categoriaId: 1, stock: 20, descuento: 0 },
  { id: 2, nombre: "Polera Cat Meme", descripcion: "Polera negra de algodón con estampado de memes de gatos.", imagen: "/img/catmeme.png", categoriaId: 1, stock: 20, descuento: 0 },
  { id: 3, nombre: "Gato SixSeven", descripcion: "Meme - Gato Sixseven 2 - Polera", imagen: "/img/sixseven.webp", categoriaId: 1, stock: 20, descuento: 20 },
  { id: 4, nombre: "Autism", descripcion: "Autism esqueleto AK - Esqueleto - Polera", imagen: "/img/autism.webp", categoriaId: 1, stock: 4, descuento: 0 },
  { id: 5, nombre: "The cat parade", descripcion: "My Chemical Romance - The Cat Parade - Polera", imagen: "/img/catparade.webp", categoriaId: 2, stock: 20, descuento: 0 },
  { id: 6, nombre: "System of a down", descripcion: "System Of a Down - Vision Logo - Polera", imagen: "/img/soad.webp", categoriaId: 2, stock: 20, descuento: 0 },
  { id: 7, nombre: "Ride the lightning", descripcion: "Metallica - Ride The Lightning - Polera", imagen: "/img/metallica.webp", categoriaId: 2, stock: 20, descuento: 15 },
  { id: 8, nombre: "Bring me the horizon", descripcion: "Bring Me The Horizon - Rock - Polera", imagen: "/img/bmth.webp", categoriaId: 2, stock: 20, descuento: 0 },
  { id: 9, nombre: "Asking Alexandria", descripcion: "Asking Alexandria - Dead - Polera", imagen: "/img/aa.webp", categoriaId: 2, stock: 3, descuento: 0 },
  { id: 10, nombre: "Bullet for my valentine", descripcion: "Bullet For My Valentine - Skull Emo 2 - Polera", imagen: "/img/bfmv.webp", categoriaId: 2, stock: 20, descuento: 0 },
  { id: 11, nombre: "The devil wears prada", descripcion: "The Devil Wears Prada - Gargoyle - Polera", imagen: "/img/tdwp.webp", categoriaId: 2, stock: 20, descuento: 0 },
  { id: 12, nombre: "Vader samurai", descripcion: "Star Wars - Darth Vader Samurai - Polera", imagen: "/img/vader.webp", categoriaId: 3, stock: 20, descuento: 10 },
].map((p) => ({
  ...p,
  codigo: "P" + String(p.id).padStart(3, "0"), // P001, P002...
  precio: 14990,
  stockCritico: 5,
}));

const REGION_RM = "Región Metropolitana de Santiago";

const USUARIOS_INICIALES = [
  { id: 1, run: "111111111", nombre: "Admin", apellidos: "Nata", correo: "admin@gmail.com", password: "admin", telefono: "", fechaNacimiento: "", rol: "Administrador", region: REGION_RM, comuna: "Santiago", direccion: "Dirección de prueba 123" },
  { id: 2, run: "123456785", nombre: "Admin", apellidos: "Ruben", correo: "admin2@gmail.com", password: "admin", telefono: "", fechaNacimiento: "", rol: "Administrador", region: REGION_RM, comuna: "Santiago", direccion: "Dirección de prueba 123" },
  { id: 3, run: "222222222", nombre: "Vendedor", apellidos: "Demo", correo: "vendedor@gmail.com", password: "1234", telefono: "", fechaNacimiento: "", rol: "Vendedor", region: REGION_RM, comuna: "Providencia", direccion: "Dirección de prueba 123" },
  { id: 4, run: "152345674", nombre: "Cliente", apellidos: "Demo", correo: "cliente@gmail.com", password: "1234", telefono: "", fechaNacimiento: "", rol: "Cliente", region: REGION_RM, comuna: "Ñuñoa", direccion: "Dirección de prueba 123" },
];

export function iniciarDB() {
  if (!localStorage.getItem(DB_KEYS.categorias)) escribir(DB_KEYS.categorias, CATEGORIAS_INICIALES);
  if (!localStorage.getItem(DB_KEYS.productos)) escribir(DB_KEYS.productos, PRODUCTOS_INICIALES);
  if (!localStorage.getItem(DB_KEYS.usuarios)) escribir(DB_KEYS.usuarios, USUARIOS_INICIALES);
  if (!localStorage.getItem(DB_KEYS.ordenes)) escribir(DB_KEYS.ordenes, []);
}

export function obtenerCategorias() {
  return leer(DB_KEYS.categorias);
}

export function nombreCategoria(id) {
  const cat = obtenerCategorias().find((c) => String(c.id) === String(id));
  return cat ? cat.nombre : "Sin categoría";
}

export function crearCategoria(nombre) {
  const categorias = obtenerCategorias();
  const nueva = { id: siguienteId(categorias), nombre: nombre.trim() };
  escribir(DB_KEYS.categorias, [...categorias, nueva]);
  return nueva;
}

export function actualizarCategoria(id, nombre) {
  const categorias = obtenerCategorias().map((c) =>
    String(c.id) === String(id) ? { ...c, nombre: nombre.trim() } : c
  );
  escribir(DB_KEYS.categorias, categorias);
}

export function eliminarCategoria(id) {
  const enUso = obtenerProductos().some((p) => String(p.categoriaId) === String(id));
  if (enUso) return false;
  escribir(
    DB_KEYS.categorias,
    obtenerCategorias().filter((c) => String(c.id) !== String(id))
  );
  return true;
}




/* ---------- PRODUCTOS ---------- */
export function obtenerProductos() {
  return leer(DB_KEYS.productos);
}

export function buscarProductoPorId(id) {
  return obtenerProductos().find((p) => String(p.id) === String(id));
}

export function buscarProductoPorCodigo(codigo) {
  return obtenerProductos().find(
    (p) => String(p.codigo).toLowerCase() === String(codigo).toLowerCase()
  );
}

/** Sirve para validar código único al crear (idExcluido = null) o al editar. */
export function existeCodigoProducto(codigo, idExcluido = null) {
  return obtenerProductos().some(
    (p) =>
      String(p.codigo).toLowerCase() === String(codigo).trim().toLowerCase() &&
      String(p.id) !== String(idExcluido)
  );
}

export function crearProducto(datos) {
  const productos = obtenerProductos();
  const nuevo = {
    descripcion: "",
    stockCritico: "",
    descuento: 0,
    imagen: "/img/Logo.jpg",
    ...datos,
    id: siguienteId(productos),
  };
  escribir(DB_KEYS.productos, [...productos, nuevo]);
  return nuevo;
}

export function actualizarProducto(id, datos) {
  const productos = obtenerProductos().map((p) =>
    String(p.id) === String(id) ? { ...p, ...datos, id: p.id } : p
  );
  escribir(DB_KEYS.productos, productos);
}

export function eliminarProducto(id) {
  escribir(
    DB_KEYS.productos,
    obtenerProductos().filter((p) => String(p.id) !== String(id))
  );
}

export function esOferta(producto) {
  return Number(producto.descuento) > 0;
}

/** Precio con el descuento de oferta aplicado (entero, en pesos). */
export function precioFinal(producto) {
  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;
  return Math.round(precio * (1 - descuento / 100));
}

export function obtenerProductosCriticos() {
  return obtenerProductos().filter(
    (p) =>
      p.stockCritico !== "" &&
      p.stockCritico !== null &&
      p.stockCritico !== undefined &&
      Number(p.stock) <= Number(p.stockCritico)
  );
}


export function descontarStock(items) {
  const productos = obtenerProductos().map((p) => {
    const item = items.find((i) => String(i.productoId) === String(p.id));
    return item
      ? { ...p, stock: Math.max(0, Number(p.stock) - Number(item.cantidad)) }
      : p;
  });
  escribir(DB_KEYS.productos, productos);
}






//usuarios
export function obtenerUsuarios() {
  return leer(DB_KEYS.usuarios);
}

export function buscarUsuarioPorId(id) {
  return obtenerUsuarios().find((u) => String(u.id) === String(id));
}

export function buscarUsuarioPorCorreo(correo) {
  const buscado = String(correo).trim().toLowerCase();
  return obtenerUsuarios().find(
    (u) => u.correo && u.correo.toLowerCase() === buscado
  );
}

export function crearUsuario(datos) {
  const usuarios = obtenerUsuarios();
  const nuevo = { rol: "Cliente", ...datos, id: siguienteId(usuarios) };
  escribir(DB_KEYS.usuarios, [...usuarios, nuevo]);
  return nuevo;
}

export function actualizarUsuario(id, datos) {
  const usuarios = obtenerUsuarios().map((u) =>
    String(u.id) === String(id) ? { ...u, ...datos, id: u.id } : u
  );
  escribir(DB_KEYS.usuarios, usuarios);
}

export function eliminarUsuario(id) {
  escribir(
    DB_KEYS.usuarios,
    obtenerUsuarios().filter((u) => String(u.id) !== String(id))
  );
}

//sesion
export function obtenerSesion() {
  return leer(DB_KEYS.sesion, null);
}

export function iniciarSesion(usuario) {
  const { password: _password, ...sinPassword } = usuario; // nunca guardamos la contraseña en la sesión
  localStorage.setItem(DB_KEYS.sesion, JSON.stringify(sinPassword));
  window.dispatchEvent(new Event("sesionActualizada"));
}

export function cerrarSesion() {
  localStorage.removeItem(DB_KEYS.sesion);
  window.dispatchEvent(new Event("sesionActualizada"));
}

//ordenes
export function obtenerOrdenes() {
  return leer(DB_KEYS.ordenes);
}

export function buscarOrdenPorId(id) {
  return obtenerOrdenes().find((o) => String(o.id) === String(id));
}

export function crearOrden(datos) {
  const ordenes = obtenerOrdenes();
  const id = siguienteId(ordenes);
  const fecha = new Date();
  const ymd = fecha.toISOString().slice(0, 10).replace(/-/g, "");
  const nueva = {
    estado: "Pendiente",
    ...datos,
    id,
    numero: `ND-${ymd}-${String(id).padStart(4, "0")}`,
    fecha: fecha.toISOString(),
  };
  escribir(DB_KEYS.ordenes, [...ordenes, nueva]);
  return nueva;
}

export function actualizarOrden(id, datos) {
  const ordenes = obtenerOrdenes().map((o) =>
    String(o.id) === String(id) ? { ...o, ...datos, id: o.id } : o
  );
  escribir(DB_KEYS.ordenes, ordenes);
}